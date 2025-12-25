from sqlalchemy import Column, String, Integer, Float, Text, JSON
from sqlalchemy.orm import relationship
from app.models.base import BaseModel


class DailyLog(BaseModel):
    __tablename__ = "daily_logs"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)  # 无外键约束
    date = Column(String, index=True)  # YYYY-MM-DD

    # Relationships
    meal_logs = relationship(
        "MealLog",
        back_populates="daily_log",
        foreign_keys="[MealLog.daily_log_id]",
        primaryjoin="DailyLog.id == MealLog.daily_log_id"
    )


class MealLog(BaseModel):
    __tablename__ = "meal_logs"

    id = Column(String, primary_key=True, index=True)
    daily_log_id = Column(String, index=True)  # 无外键约束
    meal_type = Column(String)  # breakfast/lunch/dinner/snack
    photo_asset_id = Column(String, nullable=True)
    note = Column(Text, nullable=True)

    # Relationships
    daily_log = relationship(
        "DailyLog",
        back_populates="meal_logs",
        foreign_keys="[MealLog.daily_log_id]",
        primaryjoin="DailyLog.id == MealLog.daily_log_id"
    )
    food_intake_items = relationship(
        "FoodIntakeItem",
        back_populates="meal_log",
        foreign_keys="[FoodIntakeItem.meal_log_id]",
        primaryjoin="MealLog.id == FoodIntakeItem.meal_log_id"
    )


class FoodIntakeItem(BaseModel):
    __tablename__ = "food_intake_items"

    id = Column(String, primary_key=True, index=True)
    meal_log_id = Column(String, index=True)  # 无外键约束
    food_id = Column(String, nullable=True)  # nullable when custom food
    custom_name = Column(String, nullable=True)
    quantity = Column(Float)
    unit = Column(String)  # g/serving/...
    grams_estimated = Column(Float)
    nutrition_estimated = Column(JSON)
    confidence = Column(Float, nullable=True)
    tags = Column(Text, nullable=True)  # comma-separated tags
    source = Column(String)  # search/manual/photo

    # Relationships
    meal_log = relationship(
        "MealLog",
        back_populates="food_intake_items",
        foreign_keys="[FoodIntakeItem.meal_log_id]",
        primaryjoin="MealLog.id == FoodIntakeItem.meal_log_id"
    )


class ExerciseLog(BaseModel):
    __tablename__ = "exercise_logs"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)  # 无外键约束
    date = Column(String, index=True)
    steps = Column(Integer, default=0)
    exercise_kcal = Column(Integer, default=0)
    source = Column(String)  # manual/platform


class WeightLog(BaseModel):
    __tablename__ = "weight_logs"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)  # 无外键约束
    date = Column(String, index=True)
    weight_kg = Column(Float)
