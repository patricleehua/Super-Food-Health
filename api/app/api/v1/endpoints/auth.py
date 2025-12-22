from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class WxLoginRequest(BaseModel):
    code: str
    device: dict = None


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
async def refresh_token():
    """
    刷新访问令牌
    """
    # TODO: Implement token refresh
    return {"access_token": "mock_token", "refresh_token": "mock_refresh_token"}


@router.post("/logout")
async def logout():
    """
    退出登录
    """
    # TODO: Implement logout
    return {"message": "Logged out successfully"}
