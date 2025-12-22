# 数据库启动和连接验证功能

## ✅ 已完成的功能

### 1. 自动数据库连接验证
- 在 FastAPI 应用启动前自动验证数据库连接
- 显示详细的数据库配置信息（驱动、主机、端口、数据库名、用户名等）
- 打印连接池配置
- 测试连接并显示结果

### 2. 数据库表信息展示
- 自动检测并列出所有数据库表
- 显示表的数量
- 以编号列表的形式美观展示

### 3. 日志系统
- 使用 Python logging 模块记录连接状态
- 区分信息、警告和错误级别
- 控制台输出和日志记录并存

### 4. 多种启动方式

#### 🚀 启动脚本 (startup.py)
```bash
python startup.py
```
功能：
- ✅ 检查环境变量
- ✅ 验证数据库连接
- ✅ 测试 Redis 连接
- ✅ 启动 FastAPI 服务

#### 🧪 数据库测试脚本 (test_db_connection.py)
```bash
python test_db_connection.py
```
功能：
- 仅测试数据库连接
- 不启动 Web 服务
- 快速验证配置

#### 🎯 直接启动 FastAPI (main.py)
```bash
python -m app.main
```
或
```bash
uvicorn app.main:app --reload
```
功能：
- 在应用启动时自动初始化数据库
- 如果连接失败，应用不会启动

### 5. 配置文件

#### app/core/database.py
核心数据库配置模块，包含：
- 数据库 URL 解析
- 连接引擎创建
- 会话管理
- 连接测试函数
- 表查询函数
- 初始化函数

#### app/main.py
FastAPI 应用主文件，已集成数据库初始化

#### DB_STARTUP.md
详细的使用文档和故障排除指南

## 📊 启动日志示例

```
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
✅ 数据库连接测试成功！

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
```

## 🔧 错误处理

### 连接失败时的输出

```
❌ 数据库连接测试失败: connection refused
```

### 缺少环境变量时的输出

```
❌ 缺少必要的环境变量: DATABASE_URL
```

### 解决方案提示

当连接失败时，系统会自动提示解决方案：
1. 检查 PostgreSQL 服务是否启动
2. 验证 .env 文件中的 DATABASE_URL
3. 确认数据库用户权限
4. 检查防火墙和网络连接

## 🎯 使用场景

### 开发阶段
```bash
# 快速测试数据库连接
python test_db_connection.py

# 完整启动（带数据库检查）
python startup.py
```

### 生产部署
```bash
# 使用 uvicorn 直接启动
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 📝 文件清单

```
api/
├── app/
│   ├── core/
│   │   ├── database.py      # 数据库配置和初始化
│   │   └── redis.py         # Redis 配置
│   └── main.py              # FastAPI 应用（已集成数据库初始化）
├── startup.py               # 完整启动脚本
├── test_db_connection.py    # 数据库连接测试脚本
├── DB_STARTUP.md            # 数据库启动详细文档
└── docs/
    └── database-setup.md    # SQLAlchemy + Alembic 迁移指南
```

## ✨ 特点

1. **自动化**：无需手动检查，应用启动时自动验证
2. **可视化**：清晰的配置信息和表列表展示
3. **容错性**：连接失败时不会崩溃，而是给出明确的错误提示
4. **灵活性**：提供多种启动方式适应不同场景
5. **详细文档**：完整的使用指南和故障排除手册

---

*功能完成时间: 2025-12-23*
