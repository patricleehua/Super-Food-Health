


1. api后端技术架构

FastAPI + Uvicorn/Gunicorn

SQLAlchemy 2.0/SQLModel + Alembic

PostgreSQL（可选：pgvector、FTS）

Redis（缓存 + 队列/Streams）

Celery（或 RQ/Dramatiq）+ Beat/定时

对象存储：S3/OSS/COS + CDN + 直传签名

鉴权：JWT/OAuth + RBAC + 审计日志

LLM：LangChain/LangGraph + 模型网关 + Prompt 版本管理 + 安全防护

可观测

Sentry（错误+性能）

Prometheus + Grafana（指标）

OpenTelemetry（trace）+ 结构化日志

2. Web用户端 + 管理端

React + Next.js + TS + Tailwind



3. 程序端

微信小程序优先（国内）

框架：Taro（React/TS 复用）

核心链路：拍照→候选→确认→份量→入账（把这条链路做到极致）