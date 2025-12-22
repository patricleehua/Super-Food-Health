#!/usr/bin/env python
"""演示工具"""
import argparse

def main():
    parser = argparse.ArgumentParser(description="演示工具")
    parser.add_argument('--name', default='World', help='要问候的名字')
    args = parser.parse_args()
    print(f"Hello, {args.name}!")

if __name__ == "__main__":
    main()
