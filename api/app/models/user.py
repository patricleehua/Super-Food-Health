from sqlalchemy import Column, String, Boolean, Integer, DateTime
from app.models.base import BaseModel


class User(BaseModel):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=True)
    phone = Column(String, unique=True, index=True, nullable=True)
    wx_openid = Column(String, unique=True, index=True, nullable=True)
    wx_unionid = Column(String, unique=True, index=True, nullable=True)
    status = Column(String, default="active")
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    last_login = Column(DateTime(timezone=True), nullable=True)


class UserProfile(BaseModel):
    __tablename__ = "user_profiles"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True)  # 无外键约束
    sex = Column(String)  # unknown/male/female
    birth_year = Column(Integer, nullable=True)
    height_cm = Column(Integer, nullable=True)
    weight_kg_current = Column(Integer, nullable=True)
    goal_type = Column(String)  # lose_weight/gain_muscle/healthy/low_sugar/low_salt
    target_weight_kg = Column(Integer, nullable=True)
    activity_level = Column(String)  # low/medium/high
    diet_preferences = Column(String, nullable=True)  # comma-separated tags
    allergens_avoid = Column(String, nullable=True)  # comma-separated tags
    timezone = Column(String, default="Asia/Shanghai")


class UserConsent(BaseModel):
    __tablename__ = "user_consents"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)  # 无外键约束
    consent_type = Column(String)  # privacy/health_sensitive/marketing/fitness_data
    version = Column(String)
    granted_at = Column(DateTime(timezone=True), nullable=True)
    revoked_at = Column(DateTime(timezone=True), nullable=True)
