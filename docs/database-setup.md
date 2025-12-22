# SQLAlchemy + Alembic 数据库迁移指南

## 📋 目录

- [概述](#概述)
- [当前配置](#当前配置)
- [初始化过程](#初始化过程)
- [日常使用](#日常使用)
- [常见错误与解决方案](#常见错误与解决方案)
- [最佳实践](#最佳实践)
- [数据库连接](#数据库连接)
- [迁移管理](#迁移管理)

---

## 概述

本文档详细说明如何在项目中正确使用 SQLAlchemy ORM 和 Alembic 进行数据库迁移管理。

### 什么是 SQLAlchemy？

SQLAlchemy 是 Python 生态中最流行的 ORM（对象关系映射）框架，它提供：
- 数据库抽象层
- ORM（对象关系映射）
- SQL 表达式语言
- 数据库迁移工具（Alembic）

### 什么是 Alembic？

Alembic 是 SQLAlchemy 的官方数据库迁移工具，用于：
- 版本控制数据库 schema
- 自动化数据库结构变更
- 团队协作开发
- 多环境部署管理

---

## 当前配置

### 环境信息

```bash
# 数据库配置
DATABASE_URL=postgresql+psycopg2://postgres:123456@localhost:5432/superfood
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=superfood
POSTGRES_USER=postgres
POSTGRES_PASSWORD=123456

# Redis 配置
REDIS_URL=redis://localhost:6379/0
REDIS_PASSWORD=123456
```

### 项目结构

```
api/
├── alembic/                  # Alembic 迁移目录
│   ├── versions/            # 迁移文件存储
│   │   └── 69049bce7ba3_initial_migration.py
│   ├── env.py              # Alembic 环境配置
│   └── script.py.mako      # 迁移脚本模板
├── app/
│   ├── models/             # SQLAlchemy 模型
│   │   ├── base.py         # Base 类定义
│   │   ├── user.py         # 用户相关模型
│   │   ├── food.py         # 食物相关模型
│   │   └── diary.py        # 日记相关模型
│   └── core/
│       └── redis.py        # Redis 配置
└── .env                     # 环境变量配置
```

### 已创建的数据库表

| 表名 | 用途 | 主要字段 |
|------|------|----------|
| `users` | 用户基本信息 | id, email, phone, wx_openid |
| `user_profiles` | 用户详细档案 | user_id, sex, height_cm, weight_kg_current |
| `user_consents` | 用户同意书 | user_id, consent_type, version |
| `food_items` | 食物数据 | id, name, category, nutrition_per_100g |
| `food_serving_units` | 食物份量单位 | food_id, unit_name, grams |
| `recipe_templates` | 食谱模板 | id, name, components, category |
| `daily_logs` | 每日记录 | user_id, date |
| `meal_logs` | 餐食记录 | daily_log_id, meal_type, photo_asset_id |
| `food_intake_items` | 食物摄入项 | meal_log_id, food_id, quantity |
| `exercise_logs` | 运动记录 | user_id, date, steps, exercise_kcal |
| `weight_logs` | 体重记录 | user_id, date, weight_kg |

---

## 初始化过程

### 1. 安装依赖

```bash
# 激活虚拟环境
source .venv/bin/activate

# 安装核心依赖
pip install sqlalchemy alembic psycopg2-binary
```

### 2. 初始化 Alembic

```bash
# 在项目根目录运行
alembic init alembic
```

这会创建：
- `alembic.ini` - Alembic 配置文件
- `alembic/env.py` - 环境配置（重要！）
- `alembic/versions/` - 迁移文件目录

### 3. 配置 env.py

```python
import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# 添加项目路径
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

# 导入模型
from app.models.base import Base
from app.models import user, diary, food

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# 关键：设置 target_metadata
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = os.getenv("DATABASE_URL", config.get_main_option("sqlalchemy.url"))
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    url = os.getenv("DATABASE_URL", config.get_main_option("sqlalchemy.url"))
    from sqlalchemy import create_engine
    connectable = create_engine(url, poolclass=pool.NullPool)

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```

### 4. 创建初始迁移

```bash
# 创建迁移文件
alembic revision -m "Initial migration"

# 编辑迁移文件，添加表创建语句
```

### 5. 运行迁移

```bash
alembic upgrade head
```

---

## 日常使用

### 1. 修改模型后创建迁移

#### 步骤 1：修改 SQLAlchemy 模型

```python
# app/models/user.py
class User(BaseModel):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    # 新增字段
    nickname = Column(String, nullable=True)  # 新增

    profile = relationship("UserProfile", back_populates="user")
```

#### 步骤 2：创建迁移

```bash
# 自动生成迁移（推荐）
alembic revision --autogenerate -m "Add nickname field to users"

# 或手动创建
alembic revision -m "Add nickname field to users"
```

#### 步骤 3：检查迁移文件

```python
# alembic/versions/xxxx_add_nickname.py
def upgrade() -> None:
    with op.batch_alter_table("users") as batch_op:
        batch_op.add_column(sa.Column('nickname', sa.String(), nullable=True))

def downgrade() -> None:
    with op.batch_alter_table("users") as batch_op:
        batch_op.drop_column('nickname')
```

#### 步骤 4：应用迁移

```bash
alembic upgrade head
```

### 2. 查看迁移状态

```bash
# 查看当前版本
alembic current

# 查看历史
alembic history

# 查看详细信息
alembic show head
```

### 3. 回滚迁移

```bash
# 回滚到上一个版本
alembic downgrade -1

# 回滚到指定版本
alembic downgrade <revision_id>

# 回滚所有迁移
alembic downgrade base
```

### 4. 在代码中使用模型

```python
# 1. 创建数据库连接
from sqlalchemy import create_engine
from app.models.user import User

engine = create_engine(os.getenv("DATABASE_URL"))

# 2. 使用 ORM Session
from sqlalchemy.orm import Session

with Session(engine) as session:
    # 查询用户
    user = session.query(User).filter(User.id == "user123").first()

    # 创建新用户
    new_user = User(
        id="user456",
        email="user@example.com",
        status="active"
    )
    session.add(new_user)
    session.commit()

    # 更新用户
    user.nickname = "New Nickname"
    session.commit()

    # 删除用户
    session.delete(user)
    session.commit()
```

### 5. 异步使用（推荐）

```python
# 安装异步驱动
pip install asyncpg

# 数据库 URL 使用 asyncpg
DATABASE_URL=postgresql+asyncpg://postgres:123456@localhost:5432/superfood

# 异步代码
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

engine = create_async_engine(os.getenv("DATABASE_URL"))

async def get_user(user_id: str):
    async with AsyncSession(engine) as session:
        user = await session.get(User, user_id)
        return user

async def create_user(user_data: dict):
    async with AsyncSession(engine) as session:
        user = User(**user_data)
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user
```

---

## 常见错误与解决方案

### ❌ 错误 1：驱动插件加载失败

```python
sqlalchemy.exc.NoSuchModuleError: Can't load plugin: sqlalchemy.dialects:driver
```

**原因：**
- psycopg2-binary 未正确安装
- DATABASE_URL 格式错误

**解决方案：**

```bash
# 重新安装驱动
pip uninstall -y psycopg2-binary
pip install --no-cache-dir psycopg2-binary

# 确认 DATABASE_URL 格式
DATABASE_URL=postgresql+psycopg2://user:password@host:5432/dbname
```

### ❌ 错误 2：表已存在

```python
sqlalchemy.exc.IntegrityError: (psycopg2.errors.DuplicateTable) relation "users" already exists
```

**原因：**
- 手动创建表后，又通过迁移创建

**解决方案：**

```bash
# 标记当前版本（跳过执行迁移）
alembic stamp head

# 或者删除表重新迁移
```

### ❌ 错误 3：数据库不存在

```python
psycopg2.OperationalError: FATAL: database "superfood" does not exist
```

**解决方案：**

```bash
# 连接到 postgres 数据库创建
docker exec -it my-postgres psql -U postgres -c "CREATE DATABASE superfood;"
```

### ❌ 错误 4：外键约束失败

```python
sqlalchemy.exc.IntegrityError: (psycopg2.errors.ForeignKeyViolation)
```

**原因：**
- 删除了父表但子表还有数据
- 外键关系配置错误

**解决方案：**

```python
# 在迁移中正确处理依赖
def upgrade() -> None:
    # 先创建父表
    op.create_table('parent_table', ...)

    # 再创建子表
    op.create_table('child_table',
        sa.Column('parent_id', sa.Integer, sa.ForeignKey('parent_table.id'))
    )
```

### ❌ 错误 5：模型导入失败

```python
ModuleNotFoundError: No module named 'app.models'
```

**原因：**
- Python 路径未正确设置
- env.py 中未添加项目路径

**解决方案：**

```python
# 在 env.py 顶部添加
import sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
```

---

## 最佳实践

### ✅ 1. 迁移文件命名规范

```bash
# 格式：<revision_id>_<description>.py
# 示例：
69049bce7ba3_initial_migration.py
a1b2c3d4e5f6_add_user_nickname.py
b2c3d4e5f6g7_modify_food_category.py
```

### ✅ 2. 迁移编写规范

```python
def upgrade() -> None:
    """升级：添加新表/字段"""
    # 使用 batch_alter_table 批量操作
    with op.batch_alter_table("users") as batch_op:
        batch_op.add_column(sa.Column('nickname', sa.String(), nullable=True))
        batch_op.create_index('ix_users_nickname', 'nickname')

def downgrade() -> None:
    """降级：回滚变更"""
    with op.batch_alter_table("users") as batch_op:
        batch_op.drop_index('ix_users_nickname')
        batch_op.drop_column('nickname')
```

### ✅ 3. 模型设计规范

```python
# app/models/base.py
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, DateTime, func

Base = declarative_base()

class BaseModel(Base):
    __abstract__ = True

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )
```

```python
# app/models/user.py
from sqlalchemy import Column, String, Boolean, Integer, DateTime
from sqlalchemy.orm import relationship
from app.models.base import BaseModel

class User(BaseModel):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)

    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False)

    # ❌ 错误：不要在模型中定义业务逻辑
    # def get_full_name(self):
    #     return f"{self.first_name} {self.last_name}"

    # ✅ 正确：在 services 中定义业务逻辑
```

### ✅ 4. 环境配置管理

```python
# app/core/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # 连接池健康检查
    pool_recycle=3600,   # 连接回收时间
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### ✅ 5. 数据类型选择

| Python 类型 | SQLAlchemy 类型 | PostgreSQL 类型 | 用途 |
|------------|-----------------|----------------|------|
| `int` | `Integer` | `INTEGER` | 整数 |
| `float` | `Float` | `DOUBLE PRECISION` | 浮点数 |
| `str` | `String` | `VARCHAR` | 字符串 |
| `str` (长文本) | `Text` | `TEXT` | 长文本 |
| `bool` | `Boolean` | `BOOLEAN` | 布尔值 |
| `datetime` | `DateTime` | `TIMESTAMP` | 日期时间 |
| `dict` | `JSON` | `JSON` | JSON 数据 |
| `list` | `JSON` | `JSON` | JSON 数组 |

### ✅ 6. 索引使用规范

```python
# 主键自动创建索引，无需手动添加

# 唯一索引
email = Column(String, unique=True, index=True)

# 普通索引
status = Column(String, index=True)

# 复合索引（性能更好）
user_id = Column(Integer, index=True)
date = Column(DateTime, index=True)

# 多列复合索引
__table_args__ = (
    Index('ix_user_date', 'user_id', 'date'),
)
```

---

## 数据库连接

### 1. 环境变量配置

```bash
# .env 文件
DATABASE_URL=postgresql+psycopg2://postgres:123456@localhost:5432/superfood
```

### 2. 同步连接

```python
from sqlalchemy import create_engine

engine = create_engine(os.getenv("DATABASE_URL"))
```

### 3. 异步连接

```python
from sqlalchemy.ext.asyncio import create_async_engine

async_engine = create_async_engine(
    os.getenv("DATABASE_URL").replace("postgresql://", "postgresql+asyncpg://")
)
```

### 4. 连接池配置

```python
engine = create_engine(
    os.getenv("DATABASE_URL"),
    pool_size=10,           # 连接池大小
    max_overflow=20,        # 最大溢出连接
    pool_pre_ping=True,     # 预检连接
    pool_recycle=3600,      # 连接回收时间（秒）
    pool_timeout=30,        # 获取连接超时时间
)
```

### 5. 测试连接

```python
from sqlalchemy import text

engine = create_engine(os.getenv("DATABASE_URL"))

# 测试连接
with engine.connect() as conn:
    result = conn.execute(text("SELECT 1"))
    print("✅ Database connected!")

# 检查表
with engine.connect() as conn:
    result = conn.execute(text("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
    """))
    tables = [row[0] for row in result.fetchall()]
    print(f"📊 Tables: {', '.join(tables)}")
```

---

## 迁移管理

### 1. 创建迁移

```bash
# 自动生成（基于模型变更）
alembic revision --autogenerate -m "描述变更"

# 手动创建
alembic revision -m "描述变更"
```

### 2. 应用迁移

```bash
# 升级到最新
alembic upgrade head

# 升级到指定版本
alembic upgrade <revision_id>

# 升级 1 个版本
alembic upgrade +1
```

### 3. 回滚迁移

```bash
# 回滚 1 个版本
alembic downgrade -1

# 回滚到基础版本（删除所有表）
alembic downgrade base

# 回滚到指定版本
alembic downgrade <revision_id>
```

### 4. 查看状态

```bash
# 当前版本
alembic current

# 历史记录
alembic history

# 详细信息
alembic show head
```

### 5. 生成 SQL 脚本

```bash
# 生成升级 SQL
alembic upgrade --sql head > upgrade.sql

# 生成降级 SQL
alembic downgrade --sql -1 > downgrade.sql
```

### 6. 合并迁移

```bash
# 合并多个分支
alembic merge heads -m "合并分支变更"
```

---

## 高级用法

### 1. 数据迁移（包含数据变更）

```python
def upgrade() -> None:
    # 添加新列
    with op.batch_alter_table("users") as batch_op:
        batch_op.add_column(sa.Column('old_email', sa.String()))

    # 迁移数据
    op.execute("""
        UPDATE users
        SET old_email = email
        WHERE old_email IS NULL
    """)

    # 修改列
    with op.batch_alter_table("users") as batch_op:
        batch_op.alter_column('email', existing_type=sa.String(), nullable=False)

def downgrade() -> None:
    with op.batch_alter_table("users") as batch_op:
        batch_op.drop_column('old_email')
```

### 2. 批量数据插入

```python
def upgrade() -> None:
    # 插入基础数据
    op.execute("""
        INSERT INTO food_items (id, name, category, status)
        VALUES
            ('food1', 'Apple', 'fruit', 'active'),
            ('food2', 'Banana', 'fruit', 'active'),
            ('food3', 'Chicken', 'meat', 'active')
        ON CONFLICT (id) DO NOTHING
    """)
```

### 3. 自定义迁移操作

```python
def upgrade() -> None:
    # 创建函数
    op.execute("""
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql
    """)

    # 创建触发器
    op.execute("""
        CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
    """)
```

### 4. 分区表

```python
def upgrade() -> None:
    # 创建分区表
    op.execute("""
        CREATE TABLE logs_2024 PARTITION OF logs
        FOR VALUES FROM ('2024-01-01') TO ('2025-01-01')
    """)
```

### 5. 全文搜索

```python
def upgrade() -> None:
    # 添加全文搜索列
    op.execute("ALTER TABLE articles ADD COLUMN search_vector tsvector")

    # 创建索引
    op.execute("""
        CREATE INDEX idx_articles_search
        ON articles USING GIN (search_vector)
    """)
```

---

## 故障排除

### 检查迁移状态

```bash
# 查看当前版本
alembic current

# 查看历史
alembic history --verbose

# 查看数据库中的版本
docker exec -it my-postgres psql -U postgres -d superfood -c "SELECT * FROM alembic_version;"
```

### 重置迁移

```bash
# 危险操作：删除所有迁移
docker exec -it my-postgres psql -U postgres -d superfood -c "DROP TABLE IF EXISTS alembic_version CASCADE;"

# 重新创建基础迁移
alembic revision -m "Reset migration"
```

### 修复损坏的迁移

```bash
# 如果迁移失败，数据库可能处于不一致状态
# 1. 检查错误
alembic current

# 2. 手动修复数据库
docker exec -it my-postgres psql -U postgres -d superfood

# 3. 标记正确版本
alembic stamp <revision_id>
```

---

## 总结

### 关键要点

1. **始终使用迁移**：不要手动修改数据库结构
2. **测试迁移**：在生产环境前先测试
3. **备份数据**：重大变更前备份
4. **版本控制**：提交迁移文件到 Git
5. **团队协作**：拉取代码后运行迁移

### 常用命令速查

```bash
# 创建迁移
alembic revision -m "描述"

# 自动生成
alembic revision --autogenerate -m "描述"

# 应用迁移
alembic upgrade head

# 回滚
alembic downgrade -1

# 查看状态
alembic current
alembic history
```

### 性能优化建议

1. **索引**：为查询字段添加索引
2. **连接池**：合理配置连接池大小
3. **分页**：大量数据查询使用分页
4. **批量操作**：使用批量插入/更新
5. **监控**：监控慢查询

---

## 参考资源

- [SQLAlchemy 官方文档](https://docs.sqlalchemy.org/)
- [Alembic 官方文档](https://alembic.sqlalchemy.org/)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [Python 类型提示指南](https://docs.python.org/3/library/typing.html)

---

*本文档最后更新：2025-12-22*
