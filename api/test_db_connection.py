#!/usr/bin/env python
"""
数据库连接测试脚本
独立运行，用于快速测试数据库连接
"""

import os
import sys

# 添加项目根目录到 Python 路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# 加载 .env 文件
from dotenv import load_dotenv
load_dotenv()

def test_database():
    """测试数据库连接"""
    print("\n" + "="*60)
    print("🧪 数据库连接测试")
    print("="*60 + "\n")

    try:
        # 导入数据库模块
        from app.core.database import (
            test_connection,
            check_tables,
            print_database_info,
            print_tables_info
        )

        # 执行测试
        print("1️⃣  执行数据库连接测试...")
        if test_connection():
            print("\n2️⃣  检查数据库表...")
            tables = check_tables()
            if tables:
                print_tables_info(tables)
            print("\n✅ 数据库测试完成！")
            return True
        else:
            print("\n❌ 数据库测试失败！")
            return False

    except Exception as e:
        print(f"\n❌ 测试过程中发生错误: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_database()
    sys.exit(0 if success else 1)
