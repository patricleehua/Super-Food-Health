from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from app.core.auth_middleware import AuthenticationMiddleware

# 在应用启动时初始化数据库
print("\n" + "="*60)
print("🚀 FastAPI 应用启动中...")
print("="*60 + "\n")

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


@app.on_event("startup")
async def startup_event():
    """
    Application startup event - runs when the server starts
    """
    print("\n" + "="*60)
    print("✅ FastAPI 应用启动成功！")
    print("="*60)
    print(f"🔗 API 地址: http://{settings.HOST}:{settings.PORT}")
    print(f"📚 文档地址: http://{settings.HOST}:{settings.PORT}/docs")
    print("="*60)
    
    # Test database connection
    try:
        from app.db.session import engine
        from sqlalchemy import text
        
        print("\n🔍 正在测试数据库连接...")
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        print("✅ 数据库连接成功！")
        print("="*60 + "\n")
    except Exception as e:
        print(f"⚠️  数据库连接测试失败: {str(e)}")
        print("💡 应用将继续启动，但数据库操作可能会失败")
        print("="*60 + "\n")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
