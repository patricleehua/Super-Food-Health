# 快速开始指南

## 🚀 一键启动

### 方式 1：完整启动（推荐）

```bash
cd api
source .venv/bin/activate
python startup.py
```

### 方式 2：快速测试

```bash
cd api
source .venv/bin/activate
python test_db_connection.py
```

这将自动：
- 检查环境变量
- 验证数据库连接
- 启动 FastAPI 服务

### 方式 2：仅测试数据库

```bash
cd api
source .venv/bin/activate
python test_db_connection.py
```

### 方式 3：直接启动应用

```bash
cd api
source .venv/bin/activate
python -m app.main
```

## 📊 预期输出

### 启动成功
你会看到类似以下输出：

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
密码:          ******
连接池大小:    5
最大溢出:      10
连接回收:      3600 秒
============================================================

🔍 正在测试数据库连接...
✅ 数据库连接成功！

📋 数据库表列表 (12 张表):
------------------------------------------------------------
 1. alembic_version
 2. daily_logs
 3. exercise_logs
 4. food_intake_items
 5. food_items
 6. food_serving_units
 7. meal_logs
 8. recipe_templates
 9. user_consents
 10. user_profiles
 11. users
 12. weight_logs
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

## ❌ 如果启动失败

### 错误：数据库连接失败

**症状：**
```
❌ 数据库连接测试失败: connection refused
```

**解决方案：**
```bash
# 检查 PostgreSQL 是否运行
docker ps | grep postgres

# 如果未运行，启动它
docker start my-postgres
```

### 错误：数据库不存在

**症状：**
```
❌ 数据库连接测试失败: database "superfood" does not exist
```

**解决方案：**
```bash
# 创建数据库
docker exec -it my-postgres psql -U postgres -c "CREATE DATABASE superfood;"
```

### 错误：Redis 连接失败

**症状：**
```
⚠️  Redis 连接失败: Error 111 connecting to localhost:6379
```

**解决方案：**
```bash
# 启动 Redis
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

## 🌐 访问应用

启动成功后，你可以访问：

- **主页**: http://localhost:8000
- **API 文档**: http://localhost:8000/docs
- **交互式 API**: http://localhost:8000/redoc
- **健康检查**: http://localhost:8000/health

## 📁 项目结构

```
api/
├── app/
│   ├── core/
│   │   ├── database.py      # 数据库配置和验证
│   │   └── redis.py         # Redis 配置
│   ├── main.py              # FastAPI 应用
│   └── ...
├── startup.py               # 启动脚本
├── test_db_connection.py    # 数据库测试脚本
├── QUICKSTART.md            # 本文件
└── DB_STARTUP.md            # 详细文档
```

## 🧪 测试 API

启动后，访问 http://localhost:8000/docs 查看所有可用的 API 端点。

示例请求：
```bash
# 健康检查
curl http://localhost:8000/health

# 获取根信息
curl http://localhost:8000/
```

## 📚 更多资源

- [数据库启动详细文档](./DB_STARTUP.md)
- [SQLAlchemy + Alembic 迁移指南](../docs/database-setup.md)
- [功能说明](./README-DATABASE.md)

---

**现在就开始吧！** 🎉
