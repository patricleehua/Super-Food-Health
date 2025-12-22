"""Initial migration

Revision ID: 69049bce7ba3
Revises: 
Create Date: 2025-12-22 18:38:50.295508

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '69049bce7ba3'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema - Create all tables."""
    # 创建 users 表
    op.create_table(
        'users',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=True),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('wx_openid', sa.String(), nullable=True),
        sa.Column('wx_unionid', sa.String(), nullable=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('is_superuser', sa.Boolean(), nullable=True),
        sa.Column('last_login', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_users_id', 'users', ['id'], unique=False)
    op.create_index('ix_users_email', 'users', ['email'], unique=True)
    op.create_index('ix_users_phone', 'users', ['phone'], unique=True)
    op.create_index('ix_users_wx_openid', 'users', ['wx_openid'], unique=True)
    op.create_index('ix_users_wx_unionid', 'users', ['wx_unionid'], unique=True)

    # 创建 user_profiles 表
    op.create_table(
        'user_profiles',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=True),
        sa.Column('sex', sa.String(), nullable=True),
        sa.Column('birth_year', sa.Integer(), nullable=True),
        sa.Column('height_cm', sa.Integer(), nullable=True),
        sa.Column('weight_kg_current', sa.Integer(), nullable=True),
        sa.Column('goal_type', sa.String(), nullable=True),
        sa.Column('target_weight_kg', sa.Integer(), nullable=True),
        sa.Column('activity_level', sa.String(), nullable=True),
        sa.Column('diet_preferences', sa.String(), nullable=True),
        sa.Column('allergens_avoid', sa.String(), nullable=True),
        sa.Column('timezone', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_user_profiles_id', 'user_profiles', ['id'], unique=False)
    op.create_index('ix_user_profiles_user_id', 'user_profiles', ['user_id'], unique=True)

    # 创建 user_consents 表
    op.create_table(
        'user_consents',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=True),
        sa.Column('consent_type', sa.String(), nullable=True),
        sa.Column('version', sa.String(), nullable=True),
        sa.Column('granted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('revoked_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_user_consents_id', 'user_consents', ['id'], unique=False)
    op.create_index('ix_user_consents_user_id', 'user_consents', ['user_id'], unique=False)

    # 创建 food_items 表
    op.create_table(
        'food_items',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('aliases', sa.Text(), nullable=True),
        sa.Column('brand', sa.String(), nullable=True),
        sa.Column('category', sa.String(), nullable=True),
        sa.Column('nutrition_per_100g', sa.JSON(), nullable=True),
        sa.Column('default_serving_g', sa.Integer(), nullable=True),
        sa.Column('source', sa.String(), nullable=True),
        sa.Column('source_ref', sa.String(), nullable=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_food_items_id', 'food_items', ['id'], unique=False)
    op.create_index('ix_food_items_name', 'food_items', ['name'], unique=False)

    # 创建 food_serving_units 表
    op.create_table(
        'food_serving_units',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('food_id', sa.String(), nullable=True),
        sa.Column('unit_name', sa.String(), nullable=True),
        sa.Column('grams', sa.Float(), nullable=True),
        sa.Column('is_default', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_food_serving_units_id', 'food_serving_units', ['id'], unique=False)
    op.create_index('ix_food_serving_units_food_id', 'food_serving_units', ['food_id'], unique=False)

    # 创建 recipe_templates 表
    op.create_table(
        'recipe_templates',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('components', sa.JSON(), nullable=True),
        sa.Column('category', sa.String(), nullable=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_recipe_templates_id', 'recipe_templates', ['id'], unique=False)
    op.create_index('ix_recipe_templates_name', 'recipe_templates', ['name'], unique=False)

    # 创建 daily_logs 表
    op.create_table(
        'daily_logs',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=True),
        sa.Column('date', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_daily_logs_id', 'daily_logs', ['id'], unique=False)
    op.create_index('ix_daily_logs_user_id', 'daily_logs', ['user_id'], unique=False)
    op.create_index('ix_daily_logs_date', 'daily_logs', ['date'], unique=False)

    # 创建 meal_logs 表
    op.create_table(
        'meal_logs',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('daily_log_id', sa.String(), nullable=True),
        sa.Column('meal_type', sa.String(), nullable=True),
        sa.Column('photo_asset_id', sa.String(), nullable=True),
        sa.Column('note', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_meal_logs_id', 'meal_logs', ['id'], unique=False)
    op.create_index('ix_meal_logs_daily_log_id', 'meal_logs', ['daily_log_id'], unique=False)

    # 创建 food_intake_items 表
    op.create_table(
        'food_intake_items',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('meal_log_id', sa.String(), nullable=True),
        sa.Column('food_id', sa.String(), nullable=True),
        sa.Column('custom_name', sa.String(), nullable=True),
        sa.Column('quantity', sa.Float(), nullable=True),
        sa.Column('unit', sa.String(), nullable=True),
        sa.Column('grams_estimated', sa.Float(), nullable=True),
        sa.Column('nutrition_estimated', sa.JSON(), nullable=True),
        sa.Column('confidence', sa.Float(), nullable=True),
        sa.Column('tags', sa.Text(), nullable=True),
        sa.Column('source', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_food_intake_items_id', 'food_intake_items', ['id'], unique=False)
    op.create_index('ix_food_intake_items_meal_log_id', 'food_intake_items', ['meal_log_id'], unique=False)

    # 创建 exercise_logs 表
    op.create_table(
        'exercise_logs',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=True),
        sa.Column('date', sa.String(), nullable=True),
        sa.Column('steps', sa.Integer(), nullable=True),
        sa.Column('exercise_kcal', sa.Integer(), nullable=True),
        sa.Column('source', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_exercise_logs_id', 'exercise_logs', ['id'], unique=False)
    op.create_index('ix_exercise_logs_user_id', 'exercise_logs', ['user_id'], unique=False)
    op.create_index('ix_exercise_logs_date', 'exercise_logs', ['date'], unique=False)

    # 创建 weight_logs 表
    op.create_table(
        'weight_logs',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=True),
        sa.Column('date', sa.String(), nullable=True),
        sa.Column('weight_kg', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_weight_logs_id', 'weight_logs', ['id'], unique=False)
    op.create_index('ix_weight_logs_user_id', 'weight_logs', ['user_id'], unique=False)
    op.create_index('ix_weight_logs_date', 'weight_logs', ['date'], unique=False)


def downgrade() -> None:
    """Downgrade schema - Drop all tables."""
    op.drop_table('weight_logs')
    op.drop_table('exercise_logs')
    op.drop_table('food_intake_items')
    op.drop_table('meal_logs')
    op.drop_table('daily_logs')
    op.drop_table('recipe_templates')
    op.drop_table('food_serving_units')
    op.drop_table('food_items')
    op.drop_table('user_consents')
    op.drop_table('user_profiles')
    op.drop_table('users')
