from fastapi import APIRouter, Query
from typing import Optional

router = APIRouter()


@router.get("/search")
async def search_foods(
    q: Optional[str] = None,
    page: int = 1,
    page_size: int = 20
):
    """
    搜索食物
    """
    # TODO: Implement food search
    return {
        "items": [],
        "page": page,
        "total": 0
    }


@router.get("/{food_id}")
async def get_food(food_id: str):
    """
    获取食物详情
    """
    # TODO: Implement get food detail
    return {"id": food_id, "name": "Mock Food"}


@router.post("/custom")
async def create_custom_food():
    """
    创建自定义食物
    """
    # TODO: Implement custom food creation
    return {"message": "Custom food created"}


@router.post("/{food_id}/report-correction")
async def report_correction():
    """
    报告食物信息纠错
    """
    # TODO: Implement correction reporting
    return {"message": "Correction reported"}
