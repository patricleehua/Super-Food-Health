"""
Redis 连接配置
支持有密码的 Redis 连接
"""
import os
import logging
from typing import Optional
from redis.asyncio import Redis, ConnectionPool
from redis.exceptions import ConnectionError, RedisError

logger = logging.getLogger(__name__)


class RedisManager:
    """Redis 连接管理器"""

    def __init__(self):
        self.redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        self.redis_host: str = os.getenv("REDIS_HOST", "localhost")
        self.redis_port: int = int(os.getenv("REDIS_PORT", "6379"))
        self.redis_db: int = int(os.getenv("REDIS_DB", "0"))
        self.redis_password: Optional[str] = os.getenv("REDIS_PASSWORD")
        self.redis_username: Optional[str] = os.getenv("REDIS_USERNAME")

        # 连接池配置
        self.max_connections: int = 20
        self.connection_pool: Optional[ConnectionPool] = None
        self._redis: Optional[Redis] = None

    async def init_redis(self) -> Redis:
        """初始化 Redis 连接"""
        if self.connection_pool is None:
            # 构建连接参数
            connection_params = {
                "host": self.redis_host,
                "port": self.redis_port,
                "db": self.redis_db,
                "max_connections": self.max_connections,
                "socket_timeout": 5,
                "socket_connect_timeout": 5,
                "retry_on_timeout": True,
            }

            # 如果有密码或用户名，添加到连接参数
            if self.redis_username:
                connection_params["username"] = self.redis_username
            if self.redis_password:
                connection_params["password"] = self.redis_password

            # 创建连接池
            self.connection_pool = ConnectionPool(**connection_params)

        # 创建 Redis 实例
        self._redis = Redis(
            connection_pool=self.connection_pool,
            decode_responses=True
        )
        return self._redis

    async def get_redis(self) -> Redis:
        """获取 Redis 实例（单例模式）"""
        if self._redis is None:
            await self.init_redis()
        return self._redis

    async def ping(self) -> bool:
        """检查 Redis 连接是否可用"""
        try:
            redis = await self.get_redis()
            await redis.ping()
            return True
        except (ConnectionError, RedisError) as e:
            logger.warning(f"Redis connection failed: {e}")
            return False

    async def close(self):
        """关闭 Redis 连接"""
        if self._redis:
            await self._redis.close()
        if self.connection_pool:
            await self.connection_pool.disconnect()


# 创建全局 Redis 管理器实例
redis_manager = RedisManager()


# 依赖注入 FastAPI
async def get_redis() -> Optional[Redis]:
    """FastAPI 依赖注入函数"""
    try:
        redis = await redis_manager.get_redis()
        # Test connection
        await redis.ping()
        return redis
    except (ConnectionError, RedisError) as e:
        logger.warning(f"Redis unavailable: {e}. Continuing without Redis.")
        return None


# 便捷方法：使用连接字符串方式
def create_redis_from_url() -> Redis:
    """直接从 REDIS_URL 创建连接（支持密码）"""
    redis_url = os.getenv("REDIS_URL")

    # 如果 URL 中包含密码，直接使用
    # 格式: redis://:password@localhost:6379/0
    #      redis://username:password@localhost:6379/0

    return Redis.from_url(
        redis_url,
        decode_responses=True,
        max_connections=20
    )


# 使用示例
"""
# 方式 1：使用依赖注入
from fastapi import Depends

@app.get("/cache-test")
async def cache_test(redis: Redis = Depends(get_redis)):
    await redis.set("key", "value")
    value = await redis.get("key")
    return {"value": value}

# 方式 2：直接使用
redis = create_redis_from_url()
await redis.set("key", "value")
"""