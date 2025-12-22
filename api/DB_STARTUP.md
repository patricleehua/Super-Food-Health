# 数据库启动和连接验证指南

## 📋 概述

本项目在启动时会自动验证数据库连接，并打印详细的配置信息。提供了多种方式启动和测试后端服务。

## 🚀 启动方式

### 方式 1：使用启动脚本（推荐）

```bash
cd api
python startup.py
```

这个脚本会：
- ✅ 检查环境变量
- ✅ 验证数据库连接
- ✅ 测试 Redis 连接
- ✅ 启动 FastAPI 服务

### 方式 2：直接运行 FastAPI

```bash
cd api
source .venv/bin/activate
python -m app.main
```

或者

```bash
source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 方式 3：仅测试数据库连接

```bash
cd api
python test_db_connection.py
```

## 📊 启动日志示例

启动成功时，你会看到类似以下的日志：

```
============================================================
🍎 Super Food Health API - 后端服务启动
============================================================

📋 检查环境配置...
✅ 环境变量检查通过

🔗 初始化数据库连接...

============================================================
🚀 启动数据库初始化检查
============================================================

============================================================
🗄️  数据库配置信息
============================================================
驱动类型:      psycopg2
主机地址:      localhost
端口号:        5432
数据库名:      superfood
用户名:        postgres
密码:          ***
连接池大小:    5
最大溢出:      10
连接回收:      3600 秒
============================================================

🔍 正在测试数据库连接...
✅ 数据库连接测试成功
✅ 数据库连接成功！

📋 数据库表列表 (11 张表):
------------------------------------------------------------
 1. daily_logs
 2. exercise_logs
 3. food_intake_items
 4. food_items
 5. food_serving_units
 6. meal_logs
 7. recipe_templates
 8. user_consents
 9. user_profiles
10. users
11. weight_logs
------------------------------------------------------------

✅ 数据库初始化完成！

🔄 检查 Redis 连接...
✅ Redis 连接成功 (localhost:6379/0)

🚀 启动 FastAPI 应用...
------------------------------------------------------------
🌐 应用地址: http://localhost:8000
📖 API 文档: http://localhost:8000/docs
🔍 API 调试: http://localhost:8000/redoc
------------------------------------------------------------

INFO: Started server process [12345]
INFO: Waiting for application startup.
INFO: Application startup complete.
INFO: Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

## ❌ 常见错误及解决方案

### 错误 1：数据库连接失败

```
❌ 数据库连接测试失败: connection to server at "localhost" (127.0.0.1), port 5432 failed
```

**解决方案：**
```bash
# 检查 PostgreSQL 容器状态
docker ps | grep postgres

# 如果容器未运行，启动它
docker start my-postgres

# 或重新创建容器
docker run -d --name my-postgres \
  -e POSTGRES_PASSWORD=123456 \
  -e POSTGRES_DB=superfood \
  -p 5432:5432 \
  pgvector/pgvector:pg16
```

### 错误 2：数据库不存在

```
❌ 数据库连接测试失败: database "superfood" does not exist
```

**解决方案：**
```bash
# 创建数据库
docker exec -it my-postgres psql -U postgres -c "CREATE DATABASE superfood;"
```

### 错误 3：缺少环境变量

```
❌ 缺少必要的环境变量: DATABASE_URL
```

**解决方案：**
```bash
# 检查 .env 文件
cat .env

# 确保有 DATABASE_URL 配置
echo "DATABASE_URL=postgresql+psycopg2://postgres:123456@localhost:5432/superfood" >> .env
```

### 错误 4：Redis 连接失败

```
⚠️  Redis 连接失败: Error 111 connecting to localhost:6379
```

**解决方案：**
```bash
# 启动 Redis 服务
docker run -d --name redis -p 6379:6379 redis:7-alpine

# 或使用系统 Redis
sudo systemctl start redis
```

## 🔧 配置说明

### 数据库配置 (app/core/database.py)

```python
DATABASE_URL = "postgresql+psycopg2://postgres:123456@localhost:5432/superfood"

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,      # 连接池健康检查
    pool_recycle=3600,       # 连接回收时间（秒）
    echo=False,              # 是否打印 SQL 日志
    pool_size=5,             # 连接池大小
    max_overflow=10,         # 最大溢出连接
)
```

### 环境变量

在 `.env` 文件中配置：

```bash
# 数据库配置
DATABASE_URL=postgresql+psycopg2://postgres:123456@localhost:5432/superfood

# Redis 配置
REDIS_URL=redis://localhost:6379/0
REDIS_PASSWORD=123456

# 应用配置
SECRET_KEY=your-secret-key
DEBUG=true
```

## 🧪 测试数据库连接

### 方法 1：使用测试脚本

```bash
python test_db_connection.py
```

### 方法 2：在 Python 中测试

```python
import os
os.environ['DATABASE_URL'] = 'postgresql+psycopg2://postgres:123456@localhost:5432/superfood'

from app.core.database import test_connection, check_tables

# 测试连接
if test_connection():
    print("✅ 连接成功")

# 查看表
tables = check_tables()
print(f"📊 共有 {len(tables)} 张表")
```

## 📝 查看日志

所有数据库连接的日志都会打印到控制台，包括：

- ✅ 连接成功信息
- ❌ 连接失败错误
- 📊 表数量和列表
- 📌 Alembic 版本信息
- 🔄 Redis 连接状态

## 🔍 调试技巧

### 1. 启用 SQL 日志

修改 `app/core/database.py`：

```python
engine = create_engine(
    DATABASE_URL,
    echo=True,  # 启用 SQL 日志
    ...
)
```

### 2. 查看详细错误

运行测试脚本会显示完整的错误堆栈：

```bash
python test_db_connection.py
```

### 3. 检查数据库状态

```bash
# 查看数据库中的表
docker exec -it my-postgres psql -U postgres -d superfood -c "\dt"

# 查看 Alembic 版本
docker exec -it my-postgres psql -U postgres -d superfood -c "SELECT * FROM alembic_version;"
```

## 🎯 最佳实践

1. **启动前检查**：使用 `startup.py` 启动，它会全面检查所有依赖
2. **环境隔离**：开发、测试、生产环境使用不同的 `.env` 文件
3. **日志监控**：关注启动日志，及时发现连接问题
4. **定期测试**：使用 `test_db_connection.py` 定期验证连接
5. **连接池优化**：根据实际负载调整连接池参数

## 📚 相关文档

- [SQLAlchemy + Alembic 迁移指南](./docs/database-setup.md)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [FastAPI 文档](https://fastapi.tiangolo.com/)

---

*最后更新: 2025-12-23*
