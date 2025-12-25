from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from app.core.database import init_database
from app.core.auth_middleware import AuthenticationMiddleware

# 在应用启动时初始化数据库
print("\n" + "="*60)
print("🚀 FastAPI 应用启动中...")
print("="*60 + "\n")

# 初始化数据库连接
try:
    init_database()
    print("\n✅ 应用启动成功！\n")
except Exception as e:
    print(f"\n❌ 数据库初始化失败: {str(e)}")
    print("应用启动终止")
    import sys
    sys.exit(1)

app = FastAPI(
    title=settings.APP_NAME,
    description="营养健康追踪应用后端API",
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
)

# CORS middleware - Configure allowed origins
allowed_origins = [
    "http://localhost:3000",  # Next.js dev server
    "http://localhost:3001",  # Alternative port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

# In production, replace with actual domain
if settings.DEBUG:
    allowed_origins.append("*")  # Allow all in development

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if not settings.DEBUG else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Authentication middleware (validates JWT for protected endpoints)
app.add_middleware(AuthenticationMiddleware)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "Super Food Health API",
        "status": "running",
        "version": settings.APP_VERSION
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
