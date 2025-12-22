"""
数据库连接配置和初始化
在应用启动时验证数据库连接并打印配置信息
"""
import os
import sys
import logging
from typing import Optional
from sqlalchemy import create_engine, text
from sqlalchemy.ext.asyncio import create_async_engine as create_async
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import StaticPool

# 加载 .env 文件
from dotenv import load_dotenv
load_dotenv()

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# 获取数据库 URL
DATABASE_URL: str = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:123456@localhost:5432/superfood"
)

# 解析数据库配置信息
def parse_database_url(url: str) -> dict:
    """解析数据库 URL 获取配置信息"""
    # 移除驱动信息
    if "://" in url:
        clean_url = url.split("://", 1)[1]
    else:
        clean_url = url

    # 解析格式: user:password@host:port/dbname
    auth = clean_url.split("@")[0] if "@" in clean_url else ""
    db_info = clean_url.split("@")[1] if "@" in clean_url else clean_url

    user = auth.split(":")[0] if ":" in auth else auth
    password = auth.split(":")[1] if ":" in auth and len(auth.split(":")) > 1 else "***"

    db_part = db_info.split("/")[-1] if "/" in db_info else "unknown"
    host_port = db_info.rsplit("/", 1)[0] if "/" in db_info else db_info

    host = host_port.split(":")[0] if ":" in host_port else host_port
    port = host_port.split(":")[1] if ":" in host_port else "5432"

    return {
        "driver": url.split("+")[1].split(":")[0] if "+" in url else "unknown",
        "user": user,
        "password": password,
        "host": host,
        "port": port,
        "database": db_part,
        "full_url": url
    }

# 创建同步引擎
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # 连接池健康检查
    pool_recycle=3600,   # 连接回收时间（秒）
    echo=False,          # 是否打印 SQL 日志（开发时可设为 True）
    pool_size=5,         # 连接池大小
    max_overflow=10,     # 最大溢出连接
)

# 创建异步引擎
async_database_url = DATABASE_URL.replace(
    "postgresql://",
    "postgresql+asyncpg://"
).replace(
    "postgresql+psycopg2://",
    "postgresql+asyncpg://"
)
async_engine = create_async(async_database_url)

# 创建会话工厂
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# 创建异步会话工厂
AsyncSessionLocal = sessionmaker(
    bind=async_engine,
    class_=type('AsyncSession', (), {}),
    expire_on_commit=False
)

# 声明基类
Base = declarative_base()

def get_db():
    """
    FastAPI 依赖注入函数
    使用方式: from app.core.database import get_db
    在路由中使用: async def endpoint(db=Depends(get_db)):
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_async_db():
    """
    FastAPI 异步依赖注入函数
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

def test_connection() -> bool:
    """
    测试数据库连接
    返回: 连接成功返回 True，否则返回 False
    """
    try:
        with engine.connect() as connection:
            # 执行简单查询测试连接
            result = connection.execute(text("SELECT 1"))
            result.fetchone()
        logger.info("✅ 数据库连接测试成功")
        return True
    except Exception as e:
        logger.error(f"❌ 数据库连接测试失败: {str(e)}")
        return False

def print_database_info():
    """
    打印数据库配置信息
    """
    db_config = parse_database_url(DATABASE_URL)

    print("\n" + "="*60)
    print("🗄️  数据库配置信息")
    print("="*60)
    print(f"驱动类型:      {db_config['driver']}")
    print(f"主机地址:      {db_config['host']}")
    print(f"端口号:        {db_config['port']}")
    print(f"数据库名:      {db_config['database']}")
    print(f"用户名:        {db_config['user']}")
    print(f"密码:          {'*' * len(db_config['password'])}")
    print(f"连接池大小:    5")
    print(f"最大溢出:      10")
    print(f"连接回收:      3600 秒")
    print("="*60)

    # 测试连接
    print("\n🔍 正在测试数据库连接...")
    if test_connection():
        print("✅ 数据库连接成功！\n")
        return True
    else:
        print("❌ 数据库连接失败！\n")
        return False

def check_tables() -> Optional[list]:
    """
    检查数据库中的表
    返回: 表名列表，如果连接失败返回 None
    """
    try:
        with engine.connect() as connection:
            result = connection.execute(text("""
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
                ORDER BY table_name
            """))
            tables = [row[0] for row in result.fetchall()]
            logger.info(f"📊 数据库中共有 {len(tables)} 张表")
            return tables
    except Exception as e:
        logger.error(f"❌ 查询表信息失败: {str(e)}")
        return None

def print_tables_info(tables: list):
    """打印表信息"""
    if not tables:
        return

    print(f"\n📋 数据库表列表 ({len(tables)} 张表):")
    print("-" * 60)
    for i, table in enumerate(tables, 1):
        print(f"{i:2d}. {table}")
    print("-" * 60)

def init_database():
    """
    初始化数据库连接
    在应用启动时调用此函数
    """
    print("\n" + "="*60)
    print("🚀 启动数据库初始化检查")
    print("="*60 + "\n")

    # 打印配置信息
    if not print_database_info():
        logger.error("数据库连接失败，请检查配置！")
        print("\n💡 提示:")
        print("1. 检查 PostgreSQL 服务是否启动")
        print("2. 验证 .env 文件中的 DATABASE_URL")
        print("3. 确认数据库用户权限")
        print("4. 检查防火墙和网络连接\n")
        sys.exit(1)

    # 检查表
    tables = check_tables()
    if tables:
        print_tables_info(tables)
        print("\n✅ 数据库初始化完成！\n")
    else:
        print("\n⚠️  无法查询表信息，但连接正常\n")

    # 打印 Alembic 版本信息
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version_num FROM alembic_version LIMIT 1"))
            version = result.fetchone()
            if version:
                logger.info(f"📌 Alembic 版本: {version[0]}")
    except Exception:
        logger.info("ℹ️  Alembic 版本表不存在或未初始化")

    logger.info("🎉 数据库初始化完成")

# 如果直接运行此模块，执行初始化检查
if __name__ == "__main__":
    init_database()
