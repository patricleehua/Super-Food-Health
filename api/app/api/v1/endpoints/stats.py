from fastapi import APIRouter, Query

router = APIRouter()


@router.get("/daily")
async def get_daily_stats(date: str = Query(..., description="Date in YYYY-MM-DD format")):
    """
    获取当日统计
    """
    # TODO: Implement daily stats
    return {
        "date": date,
        "total_kcal": 0,
        "macros": {
            "protein_g": 0,
            "fat_g": 0,
            "carbs_g": 0
        },
        "key_metrics": {
            "sodium_mg": 0,
            "sugar_g": 0,
            "fiber_g": 0
        },
        "green_score": 0
    }


@router.get("/range")
async def get_range_stats(start: str, end: str):
    """
    获取日期范围趋势
    """
    # TODO: Implement range stats
    return {
        "start": start,
        "end": end,
        "trend": []
    }


@router.post("/goals/calculate")
async def calculate_goals():
    """
    计算建议目标
    """
    # TODO: Implement goals calculation
    return {
        "kcal_budget_range": [1600, 1900],
        "macros_target": {
            "protein_g": [90, 110],
            "fat_g": [45, 60],
            "carbs_g": [170, 220]
        },
        "notes": ["按你的活动水平建议..."]
    }
