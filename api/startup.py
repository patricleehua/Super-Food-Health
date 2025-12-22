#!/usr/bin/env python
"""
后端应用启动脚本
在启动 FastAPI 应用前进行数据库连接检查
"""

import os
import sys

# 添加项目根目录到 Python 路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# 加载 .env 文件
from dotenv import load_dotenv
load_dotenv()

def main():
    """主启动函数"""
    print("\n" + "="*60)
    print("🍎 Super Food Health API - 后端服务启动")
    print("="*60 + "\n")

    # 1. 检查环境变量
    print("📋 检查环境配置...")
    required_env_vars = [
        "DATABASE_URL",
        "SECRET_KEY"
    ]

    missing_vars = []
    for var in required_env_vars:
        if not os.getenv(var):
            missing_vars.append(var)

    if missing_vars:
        print(f"❌ 缺少必要的环境变量: {', '.join(missing_vars)}")
        print("\n💡 请在 .env 文件中配置这些变量")
        sys.exit(1)
    else:
        print("✅ 环境变量检查通过")

    # 2. 初始化数据库连接
    print("\n🔗 初始化数据库连接...")
    try:
        from app.core.database import init_database
        init_database()
    except Exception as e:
        print(f"\n❌ 数据库初始化失败: {str(e)}")
        print("\n💡 解决方案:")
        print("1. 确认 PostgreSQL 服务正在运行")
        print("2. 检查 .env 文件中的数据库配置")
        print("3. 验证数据库用户权限")
        sys.exit(1)

    # 3. 检查 Redis 连接
    print("\n🔄 检查 Redis 连接...")
    try:
        import redis
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        redis_password = os.getenv("REDIS_PASSWORD")
        redis_host = redis_url.split("@")[-1].split(":")[0] if "@" in redis_url else "localhost"
        redis_port = redis_url.split(":")[-1].split("/")[0] if ":" in redis_url else "6379"
        redis_db = redis_url.split("/")[-1] if "/" in redis_url else "0"

        # 尝试连接
        r = redis.Redis(
            host=redis_host,
            port=int(redis_port),
            db=int(redis_db),
            password=redis_password,
            socket_connect_timeout=5
        )
        r.ping()
        print(f"✅ Redis 连接成功 ({redis_host}:{redis_port}/{redis_db})")
    except Exception as e:
        print(f"⚠️  Redis 连接失败: {str(e)}")
        print("💡 Redis 可选，如果不需要可以忽略此错误")

    # 4. 启动 FastAPI 应用
    print("\n🚀 启动 FastAPI 应用...")
    print("-" * 60)
    print("🌐 应用地址: http://localhost:8000")
    print("📖 API 文档: http://localhost:8000/docs")
    print("🔍 API 调试: http://localhost:8000/redoc")
    print("-" * 60 + "\n")

    # 导入并启动 FastAPI
    try:
        import uvicorn
        from app.main import app

        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,  # 开发模式下自动重载
            log_level="info"
        )
    except ImportError as e:
        print(f"❌ 导入模块失败: {str(e)}")
        print("\n💡 请确保已安装所有依赖:")
        print("pip install -r requirements.txt")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n\n👋 应用已停止")
    except Exception as e:
        print(f"\n❌ 启动失败: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
