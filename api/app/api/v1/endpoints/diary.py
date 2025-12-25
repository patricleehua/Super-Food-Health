from fastapi import APIRouter, Path, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import uuid

from app.db.session import get_db
from app.models.diary import DailyLog, MealLog, FoodIntakeItem
from app.core.auth_middleware import get_current_user

# Schemas
class NutritionData(BaseModel):
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    fiber_g: Optional[float] = None
    sugar_g: Optional[float] = None
    sodium_mg: Optional[float] = None


class FoodIntakeItemCreate(BaseModel):
    food_id: Optional[str] = None
    custom_name: Optional[str] = None
    quantity: float
    unit: str
    grams_estimated: float
    nutrition_estimated: NutritionData
    source: str = "manual"


class FoodIntakeItemResponse(BaseModel):
    id: str
    food_id: Optional[str]
    custom_name: Optional[str]
    quantity: float
    unit: str
    grams_estimated: float
    nutrition_estimated: dict
    source: str
    created_at: str

    class Config:
        from_attributes = True


class MealLogResponse(BaseModel):
    id: str
    meal_type: str
    photo_asset_id: Optional[str]
    note: Optional[str]
    food_intake_items: List[FoodIntakeItemResponse]
    total_calories: float
    created_at: str

    class Config:
        from_attributes = True


class DailyLogResponse(BaseModel):
    id: str
    date: str
    meal_logs: List[MealLogResponse]
    total_calories: float
    created_at: str

    class Config:
        from_attributes = True


class MealCreate(BaseModel):
    meal_type: str
    note: Optional[str] = None


router = APIRouter()


@router.post("/{date}")
async def create_daily_log(
    date: str = Path(..., description="Date in YYYY-MM-DD format"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    确保某天的DailyLog存在（幂等）
    """
    # Validate date format
    try:
        datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    # Check if daily log already exists
    existing_log = db.query(DailyLog).filter(
        DailyLog.user_id == current_user["id"],
        DailyLog.date == date
    ).first()
    
    if existing_log:
        return {"id": existing_log.id, "date": date, "message": "Daily log already exists"}
    
    # Create new daily log
    daily_log = DailyLog(
        id=str(uuid.uuid4()),
        user_id=current_user["id"],
        date=date
    )
    db.add(daily_log)
    db.commit()
    db.refresh(daily_log)
    
    return {"id": daily_log.id, "date": date, "message": "Daily log created"}


@router.get("/{date}", response_model=DailyLogResponse)
async def get_daily_log(
    date: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    获取当日日记
    """
    # Validate date format
    try:
        datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    # Get or create daily log
    daily_log = db.query(DailyLog).filter(
        DailyLog.user_id == current_user["id"],
        DailyLog.date == date
    ).first()
    
    if not daily_log:
        # Auto-create if not exists
        daily_log = DailyLog(
            id=str(uuid.uuid4()),
            user_id=current_user["id"],
            date=date
        )
        db.add(daily_log)
        db.commit()
        db.refresh(daily_log)
    
    # Calculate totals
    total_calories = 0
    meal_logs_response = []
    
    for meal_log in daily_log.meal_logs:
        meal_calories = sum(
            item.nutrition_estimated.get("calories", 0)
            for item in meal_log.food_intake_items
        )
        total_calories += meal_calories
        
        meal_logs_response.append(MealLogResponse(
            id=meal_log.id,
            meal_type=meal_log.meal_type,
            photo_asset_id=meal_log.photo_asset_id,
            note=meal_log.note,
            food_intake_items=[
                FoodIntakeItemResponse(
                    id=item.id,
                    food_id=item.food_id,
                    custom_name=item.custom_name,
                    quantity=item.quantity,
                    unit=item.unit,
                    grams_estimated=item.grams_estimated,
                    nutrition_estimated=item.nutrition_estimated,
                    source=item.source,
                    created_at=item.created_at.isoformat()
                )
                for item in meal_log.food_intake_items
            ],
            total_calories=meal_calories,
            created_at=meal_log.created_at.isoformat()
        ))
    
    return DailyLogResponse(
        id=daily_log.id,
        date=daily_log.date,
        meal_logs=meal_logs_response,
        total_calories=total_calories,
        created_at=daily_log.created_at.isoformat()
    )


@router.post("/{date}/meals")
async def create_meal(
    date: str,
    meal_data: MealCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    创建餐次
    """
    # Validate date format
    try:
        datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    # Get or create daily log
    daily_log = db.query(DailyLog).filter(
        DailyLog.user_id == current_user["id"],
        DailyLog.date == date
    ).first()
    
    if not daily_log:
        daily_log = DailyLog(
            id=str(uuid.uuid4()),
            user_id=current_user["id"],
            date=date
        )
        db.add(daily_log)
        db.commit()
        db.refresh(daily_log)
    
    # Create meal log
    meal_log = MealLog(
        id=str(uuid.uuid4()),
        daily_log_id=daily_log.id,
        meal_type=meal_data.meal_type,
        note=meal_data.note
    )
    db.add(meal_log)
    db.commit()
    db.refresh(meal_log)
    
    return {"meal_id": meal_log.id, "date": date, "meal_type": meal_data.meal_type}


@router.post("/meals/{meal_id}/items")
async def add_food_item(
    meal_id: str,
    item_data: FoodIntakeItemCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    添加食物条目
    """
    # Verify meal exists and belongs to user
    meal_log = db.query(MealLog).filter(MealLog.id == meal_id).first()
    if not meal_log:
        raise HTTPException(status_code=404, detail="Meal not found")
    
    daily_log = db.query(DailyLog).filter(
        DailyLog.id == meal_log.daily_log_id,
        DailyLog.user_id == current_user["id"]
    ).first()
    if not daily_log:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Create food intake item
    food_item = FoodIntakeItem(
        id=str(uuid.uuid4()),
        meal_log_id=meal_id,
        food_id=item_data.food_id,
        custom_name=item_data.custom_name,
        quantity=item_data.quantity,
        unit=item_data.unit,
        grams_estimated=item_data.grams_estimated,
        nutrition_estimated=item_data.nutrition_estimated.dict(),
        source=item_data.source
    )
    db.add(food_item)
    db.commit()
    db.refresh(food_item)
    
    return {"item_id": food_item.id, "meal_id": meal_id}


@router.patch("/meal-items/{item_id}")
async def update_food_item(
    item_id: str,
    item_data: FoodIntakeItemCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    修改食物条目
    """
    # Find item and verify ownership
    food_item = db.query(FoodIntakeItem).filter(FoodIntakeItem.id == item_id).first()
    if not food_item:
        raise HTTPException(status_code=404, detail="Food item not found")
    
    meal_log = db.query(MealLog).filter(MealLog.id == food_item.meal_log_id).first()
    daily_log = db.query(DailyLog).filter(
        DailyLog.id == meal_log.daily_log_id,
        DailyLog.user_id == current_user["id"]
    ).first()
    if not daily_log:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Update item
    food_item.food_id = item_data.food_id
    food_item.custom_name = item_data.custom_name
    food_item.quantity = item_data.quantity
    food_item.unit = item_data.unit
    food_item.grams_estimated = item_data.grams_estimated
    food_item.nutrition_estimated = item_data.nutrition_estimated.dict()
    
    db.commit()
    
    return {"message": "Item updated", "item_id": item_id}


@router.delete("/meal-items/{item_id}")
async def delete_food_item(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    删除食物条目
    """
    # Find item and verify ownership
    food_item = db.query(FoodIntakeItem).filter(FoodIntakeItem.id == item_id).first()
    if not food_item:
        raise HTTPException(status_code=404, detail="Food item not found")
    
    meal_log = db.query(MealLog).filter(MealLog.id == food_item.meal_log_id).first()
    daily_log = db.query(DailyLog).filter(
        DailyLog.id == meal_log.daily_log_id,
        DailyLog.user_id == current_user["id"]
    ).first()
    if not daily_log:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Delete item
    db.delete(food_item)
    db.commit()
    
    return {"message": "Item deleted", "item_id": item_id}


@router.post("/meals/{meal_id}/clone")
async def clone_meal(
    meal_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    复制上一天同餐
    """
    # Find source meal and verify ownership
    source_meal = db.query(MealLog).filter(MealLog.id == meal_id).first()
    if not source_meal:
        raise HTTPException(status_code=404, detail="Source meal not found")
    
    daily_log = db.query(DailyLog).filter(
        DailyLog.id == source_meal.daily_log_id,
        DailyLog.user_id == current_user["id"]
    ).first()
    if not daily_log:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # TODO: Implement meal cloning logic
    return {"message": "Meal cloning not yet implemented"}


@router.post("/meals/{meal_id}/photo-analyze")
async def analyze_photo(
    meal_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    拍照识别
    """
    # TODO: Implement photo analysis
    return {"task_id": "mock_task_id", "message": "Photo analysis not yet implemented"}


@router.get("/tasks/{task_id}")
async def get_task_status(task_id: str):
    """
    获取任务状态
    """
    # TODO: Implement task status retrieval
    return {"status": "pending", "result": None}


@router.post("/meals/{meal_id}/photo-confirm")
async def confirm_photo_analysis(
    meal_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    确认识别结果并入账
    """
    # TODO: Implement photo confirmation
    return {"message": "Photo confirmation not yet implemented"}
