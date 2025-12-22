



# 0. 总体架构与边界

## 三端目标分工

- **WX MiniApp**：高频入口（拍照/快速记录/即时建议/打卡与订阅转化）
- **Web 用户端**：低频深度（趋势、周报月报、计划、导出、账号与隐私）
- **Web 管理端（同一 Next.js 项目）**：食物库治理、审核流、建议模板/绿色评分规则配置、会员与订单、活动、审计

## 后端服务边界（同一 FastAPI 项目也可）

- **Auth & Account**：登录、会话、权限

- **Core Diary**：饮食日记、摄入、运动消耗、目标

- **Food & Nutrition**：食物库、份量单位、别名、套餐模板、用户纠错

- **AI & Insights**：建议、对比分析、周报月报、长期预测（编排层）

- **Billing**：订阅、权益、订单、发票/退款（先预留）

- **Ops & Config**：运营活动、推送配置、建议模板、绿色评分规则

- **Compliance**：同意管理、数据导出/删除、审计日志

  

------

# 1. 账号体系与权限

## 1.1 身份体系

- **C 端用户**：miniapp/web 共用一个用户体系
- **后台管理员**：独立账号体系（也可复用同表但用 role 区分）

## 1.2 登录方式

- MiniApp：`wx.login` → 后端换取 session / JWT
- Web：邮箱验证码 / 密码 / OAuth（先选一个最简单的）

## 1.3 Token 与会话

- Access Token（短时）+ Refresh Token（长时）
- 管理端必须 RBAC + 审计日志

## 1.4 管理端角色（RBAC）

- `SUPER_ADMIN`（全）
- `OPS`（活动、推送、文案、A/B）
- `REVIEWER`（食物库/纠错审核）
- `CS`（客服、退款工单、用户问题）
- `ANALYST`（只读报表）
- `NUTRITION_EDITOR`（建议模板、绿色规则配置）

------

# 2. 核心数据模型（表/对象口径）

> 这里是“业务口径”，你按此建表即可。

## 2.1 用户与档案

**User**

- `id`
- `phone/email`（可选）
- `wx_openid/unionid`（如用微信）
- `created_at`, `status`

**UserProfile**

- `user_id`
- `sex`（unknown/male/female）
- `birth_year`（或 age_range）
- `height_cm`
- `weight_kg_current`
- `goal_type`（lose_weight/gain_muscle/healthy/low_sugar/low_salt）
- `target_weight_kg`（可空）
- `activity_level`（low/medium/high）
- `diet_preferences`（辣/素食/清淡/外卖频率等 tags）
- `allergens_avoid`（tags）
- `timezone`（默认 Asia/Shanghai 或 Asia/Tokyo 也可）

**UserConsent**

- `user_id`
- `consent_type`（privacy/health_sensitive/marketing/fitness_data）
- `version`
- `granted_at`, `revoked_at`

## 2.2 食物与营养库

**FoodItem**（标准食物）

- `id`
- `name`
- `aliases[]`
- `brand`（可空）
- `category`（grain/meat/veg/...）
- `nutrition_per_100g`：`kcal, protein_g, fat_g, carbs_g, sugar_g, sodium_mg, fiber_g`
- `default_serving_g`（可空）
- `source`（CDC/USDA/user/other）
- `source_ref`（链接/编号）
- `status`（active/pending/archived）

**FoodServingUnit**

- `id`
- `food_id`
- `unit_name`（份/碗/勺/片/个/两）
- `grams`（该单位对应的克重）
- `is_default`

**RecipeTemplate / MealTemplate**（复合餐模板）

- `id`
- `name`
- `components[]`：`food_id, default_g, optional, tag`
- `category`（hotpot/malatang/bento/...）
- `status`

## 2.3 日记与记录

**DailyLog**

- `id`
- `user_id`
- `date`（YYYY-MM-DD）
- `created_at`

**MealLog**（早餐/午餐/晚餐/加餐）

- `id`
- `daily_log_id`
- `meal_type`（breakfast/lunch/dinner/snack）
- `photo_asset_id`（可空）
- `note`（可空）
- `created_at`

**FoodIntakeItem**

- `id`
- `meal_log_id`
- `food_id`（可空：当还未映射到标准条目时）
- `custom_name`（可空）
- `quantity`（数值）
- `unit`（g/serving/…）
- `grams_estimated`
- `nutrition_estimated`（kcal + 宏量 + 关键项）
- `confidence`（识别置信度/估算置信度）
- `tags[]`（外卖/含糖饮料/酒精/夜宵/重口等）
- `source`（search/manual/photo）

**ExerciseLog**（可选）

- `user_id`
- `date`
- `steps`
- `exercise_kcal`
- `source`（manual/platform）

**WeightLog**

- `user_id`
- `date`
- `weight_kg`

## 2.4 AI 建议与报告（可回溯）

**InsightRecord**

- `id`
- `user_id`
- `scope`（meal/day/week/month/compare/forecast）
- `date_range`
- `inputs_ref`（引用哪些 meal/dailylog）
- `output`（结构化 JSON + 文案）
- `evidence`（“依据摘要”：比如盐偏高/蔬菜不足）
- `created_at`
- `model_version`（可空）

## 2.5 会员与权益（预留）

**Subscription**

- `user_id`
- `plan`（free/pro/premium）
- `status`（active/canceled/expired）
- `start_at`, `end_at`
- `source`（wxpay/webpay）
- `auto_renew`

**Entitlement**

- `user_id`
- `feature_code`
- `limit`（例如每日生成报告次数）
- `valid_until`

------

# 3. API 设计规范（通用）

- Base URL：`/api/v1`
- Auth：`Authorization: Bearer <access_token>`
- 幂等：涉及创建订单/任务使用 `Idempotency-Key`
- 分页：`page, page_size` 或 cursor
- 错误结构：

```json
{ "error": { "code": "FOOD_NOT_FOUND", "message": "..." , "details": {...}}}
```

- 所有“AI 输出”尽量返回 **结构化字段 + 渲染文案**（便于多端一致）

------

# 4. API 详细清单（可直接做 OpenAPI）

## 4.1 Auth（用户）

### POST /auth/wx/login

**用途**：小程序登录
**Req**

```json
{ "code": "wx_code", "device": { "os": "iOS", "ver": "..." } }
```

**Res**

```json
{ "access_token": "...", "refresh_token": "...", "user": { "id": "...", "is_new": true } }
```

### POST /auth/refresh

### POST /auth/logout

------

## 4.2 用户档案

### GET /me

### PATCH /me/profile

**Req**

```json
{
  "sex":"female",
  "height_cm":165,
  "weight_kg_current":58,
  "goal_type":"lose_weight",
  "target_weight_kg":52,
  "activity_level":"medium",
  "diet_preferences":["spicy","takeout_often"],
  "allergens_avoid":["shrimp"]
}
```

### POST /me/consents/grant

### POST /me/consents/revoke

### GET /me/consents

------

## 4.3 食物库（用户侧）

### GET /foods/search?q=&page=

**Res**

```json
{ "items":[ { "id":"f1","name":"鸡胸肉","kcal_per_100g":120,"aliases":["..."] } ], "page":1, "total": 1234 }
```

### GET /foods/{id}

返回：营养、单位、默认份量、来源说明

### POST /foods/custom

用户自定义食物（先入 pending 或仅自己可见）
**Req**

```json
{
  "name":"我家红烧排骨",
  "nutrition_per_100g": { "kcal":240, "protein_g":14, "fat_g":18, "carbs_g":6, "sodium_mg":600 }
}
```

### POST /foods/{id}/report-correction

用户纠错（别名、营养、单位、图片）
**Req**

```json
{ "type":"alias_add", "value":"XX外卖鸡胸肉", "note":"经常识别不到" }
```

------

## 4.4 上传与资产

### POST /assets/upload-url

返回预签名上传地址（照片/报告）
**Req**

```json
{ "purpose":"meal_photo", "content_type":"image/jpeg" }
```

**Res**

```json
{ "asset_id":"a1", "upload_url":"...", "view_url":"..." }
```

------

## 4.5 日记：创建/编辑/查询

### POST /diary/{date}

确保某天的 DailyLog 存在（幂等）

### GET /diary/{date}

返回当日：餐次、条目、统计摘要

### POST /diary/{date}/meals

**Req**

```json
{ "meal_type":"lunch", "photo_asset_id":"a1", "note":"外卖" }
```

**Res**：`meal_id`

### POST /meals/{meal_id}/items

添加条目（搜索/手动/识别后确认）
**Req**

```json
{
  "food_id":"f1",
  "quantity":1,
  "unit":"serving",
  "grams_estimated":150,
  "tags":["takeout"]
}
```

### PATCH /meal-items/{item_id}

修改份量/单位/标签

### DELETE /meal-items/{item_id}

### POST /meals/{meal_id}/clone

复制上一天同餐（便捷）

------

## 4.6 拍照识别（业务接口，AI/识别在后端异步跑）

### POST /meals/{meal_id}/photo-analyze

**Req**

```json
{ "photo_asset_id":"a1", "mode":"simple|complex" }
```

**Res**

```json
{ "task_id":"t1" }
```

### GET /tasks/{task_id}

返回识别进度与结果
**Res（成功）**

```json
{
  "status":"succeeded",
  "result":{
    "candidates":[
      { "food_id":"f1", "name":"米饭", "confidence":0.72, "suggested_servings":[{"unit":"bowl","grams":200}] },
      { "food_id":"f2", "name":"番茄炒蛋", "confidence":0.66 }
    ],
    "need_user_confirm": true
  }
}
```

### POST /meals/{meal_id}/photo-confirm

用户确认识别结果并入账
**Req**

```json
{
  "confirmed_items":[
    { "food_id":"f1","quantity":1,"unit":"bowl","grams_estimated":200 },
    { "food_id":"f2","quantity":1,"unit":"serving","grams_estimated":180 }
  ],
  "removed_candidates":["..."],
  "added_items":[ { "food_id":"f3","quantity":1,"unit":"serving","grams_estimated":100 } ]
}
```

------

## 4.7 统计与目标

### GET /stats/daily?date=

返回当日总热量、宏量、关键项、绿色分（结构化）

### GET /stats/range?start=&end=

返回趋势（用于 Web 看板）

### POST /goals/calculate

按用户档案给出“建议预算区间”（可解释）
**Res**

```json
{
  "kcal_budget_range":[1600,1900],
  "macros_target": { "protein_g":[90,110], "fat_g":[45,60], "carbs_g":[170,220] },
  "notes":[ "按你的活动水平建议..." ]
}
```

------

## 4.8 对比分析（强差异化）

### POST /insights/compare

**Req**

```json
{
  "user_context": { "goal_type":"lose_weight" },
  "a": { "items":[{"food_id":"f1","grams":200}] },
  "b": { "items":[{"food_id":"f2","grams":200}] }
}
```

**Res**

```json
{
  "diff": {
    "kcal": { "a":260, "b":180 },
    "protein_g": { "a":6, "b":20 },
    "sodium_mg": { "a":900, "b":350 }
  },
  "verdict":"B 更适合减脂：热量更低、蛋白更高",
  "actions":[ "把A的酱料减半可降低钠摄入", "加一份蔬菜提升纤维" ],
  "green_score": { "a":62, "b":78 }
}
```

------

## 4.9 建议、周报月报、长期预测（Insight）

### POST /insights/meal

输入 meal_id → 输出当餐建议（免费也可做基础版）

### POST /insights/day

输入 date → 输出当日总结与补救建议（可设为付费）

### POST /insights/week

输入 date_range → 周报（可异步）
返回 task_id 或直接返回简版

### POST /insights/forecast

长期趋势预测（付费）
**Req**

```json
{ "horizon_days":30, "assumptions": { "steps_per_day":6000, "exercise_kcal_per_day":200 } }
```

> 注意：这些接口要同时返回：

- `structured`（可渲染卡片/图表）
- `copywriting`（一句话+可执行动作）
- `evidence`（依据摘要：盐高/蔬菜不足等，便于可解释）

------

## 4.10 打卡与挑战

### GET /checkin/today

### POST /checkin

**Req**

```json
{ "type":"log_meal", "meta": { "meals_logged": 3 } }
```

### GET /challenges

### POST /challenges/{id}/join

### GET /challenges/{id}/progress

------

## 4.11 订阅/权益（先把口径定了）

### GET /billing/plans

### POST /billing/subscribe

（小程序用微信支付时：创建预支付单、回调确认）

### GET /me/subscription

### POST /billing/cancel

**权益校验建议统一走**

### GET /entitlements

返回功能开关（前端据此展示/拦截）

------

# 5. 管理端 API（/admin/v1）

## 5.1 管理员登录

### POST /admin/auth/login

### GET /admin/me

## 5.2 食物库治理

### GET /admin/foods?status=&q=

### POST /admin/foods

### PATCH /admin/foods/{id}

### POST /admin/foods/{id}/units

### GET /admin/food-corrections?status=

### POST /admin/food-corrections/{id}/approve

### POST /admin/food-corrections/{id}/reject

## 5.3 模板与规则配置（核心资产）

### GET /admin/green-score/rules

### PATCH /admin/green-score/rules

（阈值、权重、分段、默认文案 key）

### GET /admin/advice-templates

### POST /admin/advice-templates

模板字段建议：

- `scenario`（meal/day/week）
- `problem_tag`（high_sodium/low_veg/low_protein/high_sugar）
- `goal_type`（可选）
- `copywriting`（主文案）
- `actions[]`（可执行动作列表）
- `priority`
- `ab_group`（可选）

## 5.4 活动与推送

### GET /admin/challenges

### POST /admin/challenges

### PATCH /admin/challenges/{id}

### POST /admin/push/campaigns

（人群、频次、时间窗、文案版本）

## 5.5 会员与订单

### GET /admin/subscriptions

### GET /admin/orders

### POST /admin/refunds

## 5.6 合规与审计

### GET /admin/audit-logs

### GET /admin/users/{id}/consents

### POST /admin/users/{id}/data-export (task)

### POST /admin/users/{id}/data-delete (task)

------

# 6. Web 前端（一个 Next.js 项目承载 用户端+管理端）

## 6.1 路由规划

- 用户端：`/app/*`
- 管理端：`/admin/*`
- 公共：`/auth/*`, `/pricing`, `/docs/privacy`

## 6.2 用户端页面清单（Web）

1. `/app/dashboard`：趋势总览（7/30/90 天）
2. `/app/diary`：日历与日记详情
3. `/app/reports`：周报/月报列表与详情
4. `/app/compare`：对比工具（高级）
5. `/app/plan`：目标模拟、计划与清单（付费）
6. `/app/profile`：档案、偏好、目标
7. `/app/privacy`：同意管理、数据导出/删除

## 6.3 管理端页面清单（Web）

1. `/admin/dashboard`：核心指标（DAU、记录率、识别确认率、纠错量、订阅转化）
2. `/admin/foods`：食物库列表/编辑
3. `/admin/corrections`：纠错审核队列
4. `/admin/rules/green-score`：绿色规则配置
5. `/admin/templates/advice`：建议模板+A/B
6. `/admin/challenges`：挑战/活动配置
7. `/admin/billing`：订阅/订单/退款
8. `/admin/audit`：审计日志
9. `/admin/users`：用户查询（客服用，字段脱敏）

------

# 7. 微信小程序（页面与核心流程）

## 7.1 页面清单

1. 首页：今日热量预算、绿色分、快捷入口（拍照/搜索/打卡）
2. 拍照页：拍照→上传→识别进度
3. 识别确认页：候选列表、份量选择、增删改 → 入账
4. 搜索页：食物检索、收藏、历史
5. 食物详情页：营养、单位换算、加入日记、对比入口
6. 日记页：按餐次编辑、复制昨日
7. 建议页：当日总结/周报入口（付费拦截）
8. 对比页：A vs B + 最小改动建议
9. 打卡/挑战页：任务、连续天数、奖励
10. 会员页：权益说明、订阅购买
11. 我的：档案、目标、隐私与同意

## 7.2 核心流程（必须打磨）

- **拍照记餐**：拍照 → 候选 → 一键确认 → 份量 → 入账 → 当餐建议卡片
- **复杂餐**：识别到复合餐 → 切换“勾选食材组件” → 估算区间 → 入账（付费点）
- **打卡**：记录达标 → 自动打卡 → 进度反馈
- **转化**：复杂餐/周报/月报/长期预测 点击即展示权益差异 + 试用策略

------

# 8. 异步任务与队列（业务任务清单）

1. `photo_analyze`：照片识别候选（任务状态：pending/running/succeeded/failed）
2. `weekly_report_generate`：周报生成（结构化+文案）
3. `monthly_report_generate`
4. `forecast_generate`
5. `data_export`：用户数据导出（合规）
6. `data_delete`：用户数据删除（合规）
7. `push_campaign_dispatch`：推送计划执行（若做）

每个任务统一用：

- `task_id`
- `status`
- `progress`（0-100）
- `result_ref`
- `error`

------

# 9. 免费/付费功能开关（统一口径）

建议由后端下发 `entitlements`：

- `COMPLEX_MEAL_BREAKDOWN`（复杂餐拆解）
- `DETAILED_NUTRITION`（糖/钠/纤维等）
- `DAILY_INSIGHT`（当日总结）
- `WEEKLY_REPORT`（周报）
- `FORECAST_30D`（30天预测）
- `PLAN_AND_LIST`（计划与清单）
- `EXPORT_REPORT_PDF`（导出）

前端只做展示与引导，后端做最终权限校验。

------

# 10. 埋点与关键指标（产品能跑起来必备）

**关键漏斗：**

- 新用户首日：登录 → 记录一餐 → 记录三餐 → 次日留存
- 拍照链路：拍照 → 识别出候选 → 确认 → 入账（耗时）
- 纠错：发生纠错 → 提交纠错 → 被采纳
- 建议：曝光 → 点击 → 采纳动作（例如“加蔬菜”打标）
- 付费：触发点曝光 → 查看权益 → 试用/购买 → 续费

埋点事件建议统一：`event_name + properties`

------

# 11. 你可以直接按这个拆 Sprint 的交付件

## Sprint 1（闭环跑通）

- Auth（wx 登录 + web 登录最小可用）
- Food 搜索/详情（含单位换算）
- Diary（创建日记、加条目、编辑删除）
- MiniApp：拍照上传 + 候选确认（即使候选先用“手动选择”也可）
- Admin：食物库基础 CRUD

## Sprint 2（核心差异化）

- photo_analyze 任务体系 + 确认入账
- compare 接口 + 小程序对比页
- 绿色分规则（先最小版）+ 当餐建议

## Sprint 3（付费与长期）

- 周报/月报任务 + Web 报告页
- 订阅权益开关 + 购买流程
- Admin：模板配置、纠错审核队列、审计日志