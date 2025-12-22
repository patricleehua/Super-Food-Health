from sqlalchemy import Column, String, Integer, Float, Text, JSON
from sqlalchemy.orm import relationship
from app.models.base import BaseModel


class FoodItem(BaseModel):
    __tablename__ = "food_items"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    aliases = Column(Text, nullable=True)  # comma-separated aliases
    brand = Column(String, nullable=True)
    category = Column(String)  # grain/meat/veg/...
    nutrition_per_100g = Column(JSON)  # kcal, protein_g, fat_g, carbs_g, sugar_g, sodium_mg, fiber_g
    default_serving_g = Column(Integer, nullable=True)
    source = Column(String)  # CDC/USDA/user/other
    source_ref = Column(String, nullable=True)
    status = Column(String, default="active")  # active/pending/archived

    # Relationships
    serving_units = relationship("FoodServingUnit", back_populates="food")


class FoodServingUnit(BaseModel):
    __tablename__ = "food_serving_units"

    id = Column(String, primary_key=True, index=True)
    food_id = Column(String, index=True)  # 无外键约束
    unit_name = Column(String)  # 份/碗/勺/片/个/两
    grams = Column(Float)
    is_default = Column(String, default="false")

    # Relationships
    food = relationship("FoodItem", back_populates="serving_units")


class RecipeTemplate(BaseModel):
    __tablename__ = "recipe_templates"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    components = Column(JSON)  # [{food_id, default_g, optional, tag}]
    category = Column(String)  # hotpot/malatang/bento/...
    status = Column(String, default="active")
