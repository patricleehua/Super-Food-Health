from fastapi import APIRouter

router = APIRouter()


@router.post("/compare")
async def compare_foods():
    """
    对比分析
    """
    # TODO: Implement comparison
    return {
        "diff": {},
        "verdict": "B 更适合减脂：热量更低、蛋白更高",
        "actions": [],
        "green_score": {"a": 62, "b": 78}
    }


@router.post("/meal")
async def get_meal_insight():
    """
    获取当餐建议
    """
    # TODO: Implement meal insight
    return {"structured": {}, "copywriting": "", "evidence": []}


@router.post("/day")
async def get_daily_insight():
    """
    获取当日总结
    """
    # TODO: Implement daily insight
    return {"structured": {}, "copywriting": "", "evidence": []}


@router.post("/week")
async def get_weekly_report():
    """
    获取周报
    """
    # TODO: Implement weekly report
    return {"task_id": "mock_task_id"}


@router.post("/forecast")
async def get_forecast():
    """
    长期预测
    """
    # TODO: Implement forecast
    return {"structured": {}, "copywriting": "", "evidence": []}
