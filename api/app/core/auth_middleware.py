"""
Authentication Middleware
Validates JWT tokens for protected endpoints with whitelist support
"""
from fastapi import Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from jose import jwt, JWTError
import logging
from typing import Optional, Dict

from app.core.config import settings
from app.core.redis import get_redis

logger = logging.getLogger(__name__)


class AuthenticationMiddleware(BaseHTTPMiddleware):
    """
    Middleware to validate JWT tokens for all requests except whitelisted endpoints
    """

    async def dispatch(self, request: Request, call_next):
        # Get request path
        path = request.url.path

        # Check if path is in whitelist (public endpoints)
        if self._is_public_endpoint(path):
            return await call_next(request)

        # Check for Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return JSONResponse(
                status_code=401,
                content={
                    "detail": "Missing authorization header",
                    "error_code": "MISSING_AUTH_HEADER"
                }
            )

        # Validate Bearer token format
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return JSONResponse(
                status_code=401,
                content={
                    "detail": "Invalid authorization header format. Expected 'Bearer <token>'",
                    "error_code": "INVALID_AUTH_FORMAT"
                }
            )

        token = parts[1]

        # Validate token
        try:
            # Check if token is blacklisted
            redis = None
            try:
                redis = await get_redis()
                if redis:
                    is_blacklisted = await redis.get(f"blacklist:{token}")
                    if is_blacklisted:
                        return JSONResponse(
                            status_code=401,
                            content={
                                "detail": "Token has been revoked",
                                "error_code": "TOKEN_REVOKED"
                            }
                        )
            except Exception as e:
                logger.warning(f"Redis check failed: {e}")

            # Decode and validate JWT token
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM]
            )
            user_id = payload.get("sub")
            
            if not user_id:
                return JSONResponse(
                    status_code=401,
                    content={
                        "detail": "Invalid token payload",
                        "error_code": "INVALID_TOKEN_PAYLOAD"
                    }
                )

            # Add user_id to request state for downstream use
            request.state.user_id = user_id
            request.state.token = token

        except JWTError as e:
            logger.warning(f"JWT validation failed: {e}")
            return JSONResponse(
                status_code=401,
                content={
                    "detail": "Invalid or expired token",
                    "error_code": "INVALID_TOKEN"
                }
            )
        except Exception as e:
            logger.error(f"Unexpected error in auth middleware: {e}")
            return JSONResponse(
                status_code=500,
                content={
                    "detail": "Internal server error",
                    "error_code": "INTERNAL_ERROR"
                }
            )

        # Continue to the endpoint
        response = await call_next(request)
        return response

    def _is_public_endpoint(self, path: str) -> bool:
        """
        Check if the endpoint is in the public whitelist
        """
        # Exact match
        if path in settings.PUBLIC_ENDPOINTS:
            return True

        # Check for path prefix matches (e.g., /docs paths)
        for public_path in settings.PUBLIC_ENDPOINTS:
            if public_path.endswith("*") and path.startswith(public_path[:-1]):
                return True

        return False


# Dependency to get current user from request state
async def get_current_user(request: Request) -> Dict[str, str]:
    """
    Dependency to extract current user from request state.
    The middleware should have already validated the token and set user_id.
    """
    user_id = getattr(request.state, "user_id", None)
    
    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return {"id": user_id}
