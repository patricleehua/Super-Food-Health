from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, foods, diary, stats, insights

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/me", tags=["users"])
api_router.include_router(foods.router, prefix="/foods", tags=["foods"])
api_router.include_router(diary.router, prefix="/diary", tags=["diary"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])
api_router.include_router(insights.router, prefix="/insights", tags=["insights"])
