from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta
from typing import Optional
import uuid
import logging
from jose import jwt, JWTError
import bcrypt
from redis.asyncio import Redis

from app.core.config import settings
from app.core.database import get_async_db
from app.core.redis import get_redis
from app.models.user import User

router = APIRouter()
logger = logging.getLogger(__name__)

# In-memory token blacklist (fallback when Redis is unavailable)
# Note: This is not persistent and only works in single-process deployments
token_blacklist: set = set()

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash (bcrypt has 72 byte limit)"""
    # Truncate to 72 bytes to match hashing behavior
    password_bytes = plain_password.encode('utf-8')[:72]
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)


def get_password_hash(password: str) -> str:
    """Hash a password (bcrypt has 72 byte limit)"""
    # Truncate to 72 bytes if necessary (bcrypt limitation)
    password_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


async def store_token_in_redis(redis: Optional[Redis], user_id: str, access_token: str, refresh_token: str):
    """Store tokens in Redis for session management"""
    if not redis:
        logger.warning("Redis not available, tokens not stored")
        return
    
    try:
        # Store access token with user_id
        access_ttl = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        await redis.setex(
            f"access_token:{user_id}",
            access_ttl,
            access_token
        )
        
        # Store refresh token with user_id
        refresh_ttl = settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
        await redis.setex(
            f"refresh_token:{user_id}",
            refresh_ttl,
            refresh_token
        )
        
        # Store token to user_id mapping for validation
        await redis.setex(
            f"token_user:{access_token}",
            access_ttl,
            user_id
        )
        
        logger.info(f"Tokens stored in Redis for user {user_id}")
    except Exception as e:
        logger.error(f"Failed to store tokens in Redis: {e}")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_async_db),
    redis: Optional[Redis] = Depends(get_redis)
) -> User:
    """Get current user from JWT token"""
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Check if token is blacklisted
        is_blacklisted = False
        
        if redis:
            # Use Redis if available
            try:
                is_blacklisted = await redis.get(f"blacklist:{token}")
            except Exception as e:
                logger.warning(f"Redis get failed: {e}, falling back to in-memory blacklist")
                is_blacklisted = token in token_blacklist
        else:
            # Fall back to in-memory blacklist
            is_blacklisted = token in token_blacklist
        
        if is_blacklisted:
            raise HTTPException(status_code=401, detail="Token has been revoked")
        
        # Decode token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # Get user from database
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Inactive user")
    
    return user


class WxLoginRequest(BaseModel):
    code: str
    device: dict = None


class EmailLoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    is_new: bool


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: UserResponse


@router.post("/login", response_model=LoginResponse)
async def login(
    request: EmailLoginRequest,
    db: AsyncSession = Depends(get_async_db),
    redis: Optional[Redis] = Depends(get_redis)
):
    """
    Email/Password login endpoint
    """
    # Query user by email
    result = await db.execute(select(User).where(User.email == request.email))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user.hashed_password:
        raise HTTPException(status_code=401, detail="Password login not set up for this account")
    
    # Verify password
    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive")
    
    # Update last login
    user.last_login = datetime.utcnow()
    await db.commit()
    
    # Generate tokens
    access_token = create_access_token(data={"sub": user.id, "email": user.email})
    refresh_token = create_access_token(
        data={"sub": user.id, "type": "refresh"},
        expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    
    # Store tokens in Redis
    await store_token_in_redis(redis, user.id, access_token, refresh_token)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {"id": user.id, "is_new": False}
    }


@router.post("/register", response_model=LoginResponse)
async def register(
    request: RegisterRequest,
    db: AsyncSession = Depends(get_async_db),
    redis: Optional[Redis] = Depends(get_redis)
):
    """
    Register new user with email/password
    """
    # Check if user exists
    result = await db.execute(select(User).where(User.email == request.email))
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    new_user = User(
        id=str(uuid.uuid4()),
        email=request.email,
        hashed_password=get_password_hash(request.password),
        is_active=True,
        status="active",
        last_login=datetime.utcnow()
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Generate tokens
    access_token = create_access_token(data={"sub": new_user.id, "email": new_user.email})
    refresh_token = create_access_token(
        data={"sub": new_user.id, "type": "refresh"},
        expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    
    # Store tokens in Redis
    await store_token_in_redis(redis, new_user.id, access_token, refresh_token)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {"id": new_user.id, "is_new": True}
    }


@router.post("/wx/login", response_model=LoginResponse)
async def wx_login(request: WxLoginRequest):
    """
    微信小程序登录
    """
    # TODO: Implement WeChat miniapp login
    # 1. Exchange code for session_key via WeChat API
    # 2. Create or get user by wx_openid
    # 3. Generate JWT tokens
    return {
        "access_token": "mock_access_token",
        "refresh_token": "mock_refresh_token",
        "user": {"id": "mock_user_id", "is_new": True}
    }


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    request: RefreshTokenRequest,
    db: AsyncSession = Depends(get_async_db),
    redis: Optional[Redis] = Depends(get_redis)
):
    """
    Refresh access token using refresh token
    """
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode refresh token
        payload = jwt.decode(
            request.refresh_token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if user_id is None or token_type != "refresh":
            raise credentials_exception
        
        # Validate refresh token in Redis if available
        if redis:
            stored_refresh_token = await redis.get(f"refresh_token:{user_id}")
            if stored_refresh_token != request.refresh_token:
                raise HTTPException(
                    status_code=401,
                    detail="Invalid or expired refresh token"
                )
        
    except JWTError:
        raise credentials_exception
    
    # Get user from database
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Inactive user")
    
    # Generate new access token
    new_access_token = create_access_token(
        data={"sub": user.id, "email": user.email}
    )
    
    # Generate new refresh token
    new_refresh_token = create_access_token(
        data={"sub": user.id, "type": "refresh"},
        expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    )
    
    # Store new tokens in Redis
    await store_token_in_redis(redis, user.id, new_access_token, new_refresh_token)
    
    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }


@router.post("/logout")
async def logout(
    token: str = Depends(oauth2_scheme),
    redis: Optional[Redis] = Depends(get_redis),
    current_user: User = Depends(get_current_user)
):
    """
    Logout user by blacklisting the current access token
    """
    try:
        # Decode token to get expiration time
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        exp = payload.get("exp")
        
        if exp:
            # Calculate remaining TTL
            current_time = datetime.utcnow().timestamp()
            ttl = int(exp - current_time)
            
            # Only blacklist if token hasn't expired yet
            if ttl > 0:
                if redis:
                    # Use Redis if available
                    try:
                        await redis.setex(
                            f"blacklist:{token}",
                            ttl,
                            "revoked"
                        )
                        logger.info(f"Token blacklisted in Redis for user {current_user.id}")
                    except Exception as e:
                        logger.warning(f"Redis setex failed: {e}, falling back to in-memory blacklist")
                        token_blacklist.add(token)
                        logger.info(f"Token blacklisted in memory for user {current_user.id}")
                else:
                    # Fall back to in-memory blacklist
                    token_blacklist.add(token)
                    logger.warning(f"Redis unavailable, token blacklisted in memory for user {current_user.id}")
    except JWTError:
        # If token decode fails, still return success
        pass
    
    return {"message": "Logged out successfully"}
