from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

from app.core.database import get_async_db
from app.models.user import User, UserProfile, UserConsent
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()


# Request/Response Models
class UserProfileUpdate(BaseModel):
    sex: Optional[str] = Field(None, pattern="^(unknown|male|female)$")
    birth_year: Optional[int] = Field(None, ge=1900, le=2024)
    height_cm: Optional[int] = Field(None, ge=50, le=300)
    weight_kg_current: Optional[int] = Field(None, ge=20, le=500)
    goal_type: Optional[str] = Field(None, pattern="^(lose_weight|gain_muscle|healthy|low_sugar|low_salt)$")
    target_weight_kg: Optional[int] = Field(None, ge=20, le=500)
    activity_level: Optional[str] = Field(None, pattern="^(low|medium|high)$")
    diet_preferences: Optional[List[str]] = None
    allergens_avoid: Optional[List[str]] = None
    timezone: Optional[str] = None


class UserProfileResponse(BaseModel):
    id: str
    user_id: str
    sex: Optional[str] = None
    birth_year: Optional[int] = None
    height_cm: Optional[int] = None
    weight_kg_current: Optional[int] = None
    goal_type: Optional[str] = None
    target_weight_kg: Optional[int] = None
    activity_level: Optional[str] = None
    diet_preferences: Optional[List[str]] = None
    allergens_avoid: Optional[List[str]] = None
    timezone: Optional[str] = None

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    id: str
    email: Optional[str] = None
    wx_openid: Optional[str] = None
    wx_unionid: Optional[str] = None
    status: str
    is_active: bool
    last_login: Optional[datetime] = None
    profile: Optional[UserProfileResponse] = None

    class Config:
        from_attributes = True


class ConsentGrantRequest(BaseModel):
    consent_type: str = Field(..., pattern="^(privacy|health_sensitive|marketing|fitness_data)$")
    version: str


class ConsentRevokeRequest(BaseModel):
    consent_type: str = Field(..., pattern="^(privacy|health_sensitive|marketing|fitness_data)$")


class ConsentResponse(BaseModel):
    id: str
    user_id: str
    consent_type: str
    version: str
    granted_at: Optional[datetime] = None
    revoked_at: Optional[datetime] = None
    is_active: bool

    class Config:
        from_attributes = True


@router.get("/", response_model=UserResponse)
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get current user profile with complete information
    """
    # Query user profile
    result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    # Convert profile to response format
    profile_data = None
    if profile:
        profile_data = UserProfileResponse(
            id=profile.id,
            user_id=profile.user_id,
            sex=profile.sex,
            birth_year=profile.birth_year,
            height_cm=profile.height_cm,
            weight_kg_current=profile.weight_kg_current,
            goal_type=profile.goal_type,
            target_weight_kg=profile.target_weight_kg,
            activity_level=profile.activity_level,
            diet_preferences=profile.diet_preferences.split(",") if profile.diet_preferences else None,
            allergens_avoid=profile.allergens_avoid.split(",") if profile.allergens_avoid else None,
            timezone=profile.timezone
        )
    
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        wx_openid=current_user.wx_openid,
        wx_unionid=current_user.wx_unionid,
        status=current_user.status,
        is_active=current_user.is_active,
        last_login=current_user.last_login,
        profile=profile_data
    )


@router.patch("/profile", response_model=UserProfileResponse)
async def update_profile(
    profile_update: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Update or create user profile
    """
    # Query existing profile
    result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    # Prepare update data
    update_data = profile_update.model_dump(exclude_unset=True)
    
    # Convert list fields to comma-separated strings
    if "diet_preferences" in update_data and update_data["diet_preferences"]:
        update_data["diet_preferences"] = ",".join(update_data["diet_preferences"])
    if "allergens_avoid" in update_data and update_data["allergens_avoid"]:
        update_data["allergens_avoid"] = ",".join(update_data["allergens_avoid"])
    
    if profile:
        # Update existing profile
        for key, value in update_data.items():
            setattr(profile, key, value)
    else:
        # Create new profile
        profile = UserProfile(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            **update_data
        )
        db.add(profile)
    
    await db.commit()
    await db.refresh(profile)
    
    return UserProfileResponse(
        id=profile.id,
        user_id=profile.user_id,
        sex=profile.sex,
        birth_year=profile.birth_year,
        height_cm=profile.height_cm,
        weight_kg_current=profile.weight_kg_current,
        goal_type=profile.goal_type,
        target_weight_kg=profile.target_weight_kg,
        activity_level=profile.activity_level,
        diet_preferences=profile.diet_preferences.split(",") if profile.diet_preferences else None,
        allergens_avoid=profile.allergens_avoid.split(",") if profile.allergens_avoid else None,
        timezone=profile.timezone
    )


@router.post("/consents/grant", response_model=ConsentResponse)
async def grant_consent(
    request: ConsentGrantRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Grant user consent for data usage
    """
    # Check if consent already exists
    result = await db.execute(
        select(UserConsent).where(
            UserConsent.user_id == current_user.id,
            UserConsent.consent_type == request.consent_type
        )
    )
    existing_consent = result.scalar_one_or_none()
    
    if existing_consent:
        # Update existing consent
        existing_consent.version = request.version
        existing_consent.granted_at = datetime.utcnow()
        existing_consent.revoked_at = None
        consent = existing_consent
    else:
        # Create new consent
        consent = UserConsent(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            consent_type=request.consent_type,
            version=request.version,
            granted_at=datetime.utcnow(),
            revoked_at=None
        )
        db.add(consent)
    
    await db.commit()
    await db.refresh(consent)
    
    return ConsentResponse(
        id=consent.id,
        user_id=consent.user_id,
        consent_type=consent.consent_type,
        version=consent.version,
        granted_at=consent.granted_at,
        revoked_at=consent.revoked_at,
        is_active=consent.revoked_at is None
    )


@router.post("/consents/revoke", response_model=ConsentResponse)
async def revoke_consent(
    request: ConsentRevokeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Revoke user consent
    """
    # Find consent to revoke
    result = await db.execute(
        select(UserConsent).where(
            UserConsent.user_id == current_user.id,
            UserConsent.consent_type == request.consent_type
        )
    )
    consent = result.scalar_one_or_none()
    
    if not consent:
        raise HTTPException(
            status_code=404,
            detail=f"Consent type '{request.consent_type}' not found"
        )
    
    if consent.revoked_at:
        raise HTTPException(
            status_code=400,
            detail="Consent already revoked"
        )
    
    # Revoke consent
    consent.revoked_at = datetime.utcnow()
    await db.commit()
    await db.refresh(consent)
    
    return ConsentResponse(
        id=consent.id,
        user_id=consent.user_id,
        consent_type=consent.consent_type,
        version=consent.version,
        granted_at=consent.granted_at,
        revoked_at=consent.revoked_at,
        is_active=False
    )


@router.get("/consents", response_model=List[ConsentResponse])
async def get_consents(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get all user consents
    """
    result = await db.execute(
        select(UserConsent)
        .where(UserConsent.user_id == current_user.id)
        .order_by(UserConsent.granted_at.desc())
    )
    consents = result.scalars().all()
    
    return [
        ConsentResponse(
            id=consent.id,
            user_id=consent.user_id,
            consent_type=consent.consent_type,
            version=consent.version,
            granted_at=consent.granted_at,
            revoked_at=consent.revoked_at,
            is_active=consent.revoked_at is None
        )
        for consent in consents
    ]
