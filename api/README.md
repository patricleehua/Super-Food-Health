# Super Food Health API

营养健康追踪应用后端API - 基于FastAPI构建的高性能RESTful API

## 🚀 技术栈

- **Web框架**: FastAPI + Uvicorn
- **数据库**: PostgreSQL + SQLAlchemy 2.0 + Alembic
- **异步支持**: AsyncPG + AsyncIO
- **缓存**: Redis
- **任务队列**: Celery
- **认证**: JWT (python-jose)
- **AI/LLM**: LangChain + LangChain Community
- **可观测性**: OpenTelemetry + Sentry
- **包管理**: uv (高性能Python包管理器)

## 📁 项目结构

```
├── app/                    # 应用主目录
│   ├── api/                # API路由
│   │   └── v1/            # API版本1
│   │       ├── endpoints/  # 端点实现
│   │       └── api.py     # 路由聚合
│   ├── core/              # 核心配置
│   │   └── config.py      # 配置管理 (Pydantic Settings)
│   ├── models/            # SQLAlchemy数据模型
│   │   ├── base.py        # 基础模型 (时间戳)
│   │   ├── user.py        # 用户相关模型
│   │   ├── food.py        # 食物相关模型
│   │   └── diary.py       # 日记相关模型
│   ├── schemas/           # Pydantic请求/响应模型
│   ├── services/          # 业务逻辑层
│   ├── db/                # 数据库相关
│   │   └── session.py     # 会话管理
│   ├── utils/             # 工具函数
│   └── tests/             # 测试文件
├── .env.example           # 环境变量示例
├── .python-version        # Python版本约束
├── pyproject.toml         # uv项目配置
├── uv.lock               # 依赖锁定文件
├── requirements.txt      # 依赖列表 (备用)
└── README.md            # 项目说明
```

## 🛠️ 快速开始

### 前置要求

- Python 3.12+
- uv 包管理器
- PostgreSQL (可选，用于开发)
- Redis (可选，用于缓存)


### 0. 激活虚拟环境
python3.12 -m venv .venv

### 1. 安装 uv

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# 或使用 pip
pip install uv
```

### 2. 克隆并进入项目

```bash
cd api/
```

### 3. 安装依赖

```bash
# uv 会自动创建虚拟环境并安装依赖
uv sync

# 或手动激活环境
source .venv/bin/activate  # Linux/macOS
# 或
.venv\Scripts\activate     # Windows
```

### 4. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库、Redis等
```

### 5. 运行服务

```bash
# 开发模式 (热重载)
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# 生产模式
uv run gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### 6. 访问API

- **API文档 (Swagger UI)**: http://localhost:8000/docs
- **ReDoc文档**: http://localhost:8000/redoc
- **健康检查**: http://localhost:8000/health

## 📋 API 端点

### 基础信息

- **Base URL**: `/api/v1`
- **认证方式**: Bearer Token (JWT)
- **响应格式**: JSON
- **错误处理**: 统一错误码结构

### 1. 认证模块 (Auth)

```
POST   /api/v1/auth/wx/login    # 微信小程序登录
POST   /api/v1/auth/refresh     # 刷新访问令牌
POST   /api/v1/auth/logout      # 退出登录
```

### 2. 用户模块 (Users)

```
GET    /api/v1/me               # 获取当前用户档案
PATCH  /api/v1/me/profile       # 更新用户档案
POST   /api/v1/me/consents/grant   # 授予数据同意
POST   /api/v1/me/consents/revoke  # 撤销数据同意
GET    /api/v1/me/consents      # 获取同意列表
```

### 3. 食物模块 (Foods)

```
GET    /api/v1/foods/search     # 搜索食物
GET    /api/v1/foods/{id}       # 获取食物详情
POST   /api/v1/foods/custom     # 创建自定义食物
POST   /api/v1/foods/{id}/report-correction  # 报告食物信息纠错
```

### 4. 日记模块 (Diary)

```
POST   /api/v1/diary/{date}     # 创建/确保日记存在 (幂等)
GET    /api/v1/diary/{date}     # 获取日记详情
POST   /api/v1/diary/{date}/meals           # 创建餐次
POST   /api/v1/meals/{meal_id}/items        # 添加食物条目
PATCH  /api/v1/meal-items/{item_id}         # 修改食物条目
DELETE /api/v1/meal-items/{item_id}         # 删除食物条目
POST   /api/v1/meals/{meal_id}/clone        # 复制上一天餐次
POST   /api/v1/meals/{meal_id}/photo-analyze  # 拍照识别
GET    /api/v1/tasks/{task_id}              # 获取任务状态
POST   /api/v1/meals/{meal_id}/photo-confirm  # 确认识别结果
```

### 5. 统计模块 (Stats)

```
GET    /api/v1/stats/daily?date=YYYY-MM-DD        # 当日营养统计
GET    /api/v1/stats/range?start=YYYY-MM-DD&end=YYYY-MM-DD  # 范围趋势
POST   /api/v1/stats/goals/calculate              # 计算建议目标
```

### 6. 洞察模块 (Insights)

```
POST   /api/v1/insights/compare    # 对比分析 (A vs B)
POST   /api/v1/insights/meal       # 当餐建议
POST   /api/v1/insights/day        # 当日总结
POST   /api/v1/insights/week       # 生成周报
POST   /api/v1/insights/forecast   # 长期预测
```

### 7. 打卡模块 (Checkin)

```
GET    /api/v1/checkin/today       # 获取今日打卡状态
POST   /api/v1/checkin             # 打卡
GET    /api/v1/challenges          # 获取挑战列表
POST   /api/v1/challenges/{id}/join  # 加入挑战
GET    /api/v1/challenges/{id}/progress  # 挑战进度
```

### 8. 会员模块 (Billing)

```
GET    /api/v1/billing/plans       # 获取订阅方案
POST   /api/v1/billing/subscribe   # 订阅会员
GET    /api/v1/me/subscription     # 当前订阅状态
POST   /api/v1/billing/cancel      # 取消订阅
GET    /api/v1/entitlements        # 获取功能权限
```

## ⚙️ 环境变量

### 必需配置

```bash
# 数据库
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/superfood
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=superfood
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# JWT认证
SECRET_KEY=your-super-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=11520

# 微信小程序 (可选)
MINIAPP_SECRET_KEY=your-miniapp-secret
MINIAPP_APPID=your-miniapp-appid
```

### 可选配置

```bash
# Redis
REDIS_URL=redis://localhost:6379/0

# AI/LLM
OPENAI_API_KEY=your-openai-api-key
LANGCHAIN_TRACING_V2=false

# 监控
SENTRY_DSN=your-sentry-dsn
OTEL_EXPORTER_OTLP_ENDPOINT=your-otlp-endpoint
```

## 🧪 开发

### 运行测试

```bash
# 安装测试依赖
uv sync --dev

# 运行所有测试
uv run pytest

# 运行测试并查看覆盖率
uv run pytest --cov=app

# 运行特定测试
uv run pytest tests/test_auth.py
```

### 代码格式化

```bash
# 使用 black 格式化代码
uv run black app/ tests/

# 使用 isort 排序导入
uv run isort app/ tests/

# 一键格式化
uv run black app/ tests/ && uv run isort app/ tests/
```

### 数据库操作

```bash
# 初始化迁移
uv run alembic init migrations

# 创建迁移
uv run alembic revision --autogenerate -m "描述"

# 应用迁移
uv run alembic upgrade head

# 回滚迁移
uv run alembic downgrade -1
```

### Celery 任务队列

```bash
# 启动worker
uv run celery -A app.services.celery worker --loglevel=info

# 启动调度器
uv run celery -A app.services.celery beat --loglevel=info

# 启动flower监控
uv run celery -A app.services.celery flower
```

## 🚀 部署

### Docker (推荐)

```bash
# 构建镜像
docker build -t superfood-api .

# 运行容器
docker run -d --name superfood-api \
  -p 8000:8000 \
  --env-file .env \
  superfood-api
```

### 生产环境

```bash
# 使用gunicorn
uv run gunicorn app.main:app \
  -w 4 \
  -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --access-logfile - \
  --error-logfile -
```

### Docker Compose

```bash
# 启动所有服务 (API + PostgreSQL + Redis)
docker-compose up -d
```

## 📊 监控与日志

### 健康检查

```bash
curl http://localhost:8000/health
```

### 指标监控

- **Prometheus**: http://localhost:8000/metrics (如已配置)
- **Sentry**: 错误自动上报 (如已配置DSN)

### 日志

```bash
# 查看实时日志
tail -f logs/app.log

# 或通过docker
docker logs -f superfood-api
```

## 🔐 安全

- 所有API端点都需要JWT认证 (除登录外)
- 密码使用bcrypt哈希
- 支持CORS跨域
- 输入验证使用Pydantic
- SQL注入防护使用SQLAlchemy ORM

## 📝 开发规范

### 代码风格

- 使用 **Black** 格式化代码
- 使用 **isort** 排序导入
- 遵循 **PEP 8** 规范
- 使用 **类型提示** (Type Hints)

### Git提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具相关
```

## 🗺️ 路线图

### Sprint 1 (MVP闭环)
- [x] 基础项目结构
- [x] FastAPI框架搭建
- [ ] 数据库模型与迁移
- [ ] 微信登录集成
- [ ] 食物搜索功能
- [ ] 日记CRUD
- [ ] 基础统计

### Sprint 2 (核心功能)
- [ ] 拍照识别
- [ ] AI建议系统
- [ ] 食物对比分析
- [ ] 绿色评分规则
- [ ] Redis缓存
- [ ] Celery异步任务

### Sprint 3 (高级功能)
- [ ] 周报/月报
- [ ] 订阅系统
- [ ] 管理端API
- [ ] OpenTelemetry监控
- [ ] 单元测试覆盖
- [ ] 性能优化

## 🤝 贡献

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目地址: https://github.com/your-org/super-food-health
- 问题反馈: https://github.com/your-org/super-food-health/issues

---

## 💡 使用技巧

### uv 常用命令

```bash
# 更新依赖
uv sync

# 添加依赖
uv add package-name

# 添加开发依赖
uv add --dev package-name

# 升级依赖
uv sync --upgrade

# 运行命令
uv run python script.py

# 激活虚拟环境
source .venv/bin/activate  # Linux/macOS
```

### API测试示例

```bash
# 健康检查
curl http://localhost:8000/health

# 获取API文档
curl http://localhost:8000/openapi.json
```
