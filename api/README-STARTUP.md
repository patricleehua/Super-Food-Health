# 🚀 数据库启动和连接验证功能

## ✅ 完成状态

**所有功能已完成并测试通过！**

## 🎯 实现的功能

### 1. 应用启动前自动验证数据库连接

每次启动 FastAPI 应用时，都会自动：
- ✅ 检查环境变量
- ✅ 验证数据库连接
- ✅ 显示数据库配置信息
- ✅ 列出所有数据库表
- ✅ 检查 Redis 连接

### 2. 详细的启动日志

启动时会看到类似以下的输出：

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

✅ 应用启动成功！

INFO:     Uvicorn running on http://0.0.0.0:8000
```

## 🚀 使用方式

### 方式 1：一键启动（推荐）

```bash
cd api
source .venv/bin/activate
python startup.py
```

### 方式 2：仅测试数据库

```bash
cd api
source .venv/bin/activate
python test_db_connection.py
```

### 方式 3：直接启动 FastAPI

```bash
cd api
source .venv/bin/activate
python -m app.main
```

## 📁 相关文件

### 核心代码
- **`app/core/database.py`** - 数据库配置和连接验证
- **`startup.py`** - 一键启动脚本
- **`test_db_connection.py`** - 数据库测试脚本
- **`app/main.py`** - FastAPI 应用（已集成数据库初始化）

### 文档文件
- **`QUICKSTART.md`** - 快速开始指南
- **`DB_STARTUP.md`** - 详细使用文档
- **`README-DATABASE.md`** - 功能说明
- **`SUMMARY.md`** - 完整总结
- **`STATUS.md`** - 项目状态

## ❌ 常见问题

### Q: 启动时提示 "缺少必要的环境变量"

A: 确保 `.env` 文件存在且包含 `DATABASE_URL` 和 `SECRET_KEY`。

### Q: 数据库连接失败

A:
1. 检查 PostgreSQL 服务是否启动：`docker ps | grep postgres`
2. 确认 `.env` 文件中的数据库配置正确
3. 验证数据库用户权限

### Q: Redis 连接失败

A: Redis 是可选的，连接失败不会影响应用启动。如需 Redis：
```bash
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

## 🌐 访问应用

启动成功后，可以访问：

- **主页**: http://localhost:8000
- **API 文档**: http://localhost:8000/docs
- **交互式 API**: http://localhost:8000/redoc
- **健康检查**: http://localhost:8000/health

## 📊 数据库表

项目包含 11 张业务表：

| 表名 | 用途 |
|------|------|
| users | 用户基本信息 |
| user_profiles | 用户详细档案 |
| user_consents | 用户同意书 |
| food_items | 食物数据 |
| food_serving_units | 食物份量单位 |
| recipe_templates | 食谱模板 |
| daily_logs | 每日记录 |
| meal_logs | 餐食记录 |
| food_intake_items | 食物摄入项 |
| exercise_logs | 运动记录 |
| weight_logs | 体重记录 |

## 🎊 项目特点

1. **自动化** - 无需手动检查，启动即验证
2. **可视化** - 美观的表格和图标展示
3. **智能化** - 自动诊断问题并给出解决方案
4. **灵活化** - 支持多种启动方式
5. **文档化** - 完整的使用指南

## 📚 更多信息

- [快速开始](./QUICKSTART.md)
- [详细文档](./DB_STARTUP.md)
- [功能总结](./SUMMARY.md)
- [项目状态](./STATUS.md)
- [SQLAlchemy + Alembic 指南](../docs/database-setup.md)

---

**🎉 现在可以放心启动你的后端服务了！**
