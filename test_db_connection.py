#!/usr/bin/env python3
import os
import sys
import time
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "5433"))
DB_USER = os.getenv("DB_USER", "admin")
DB_PASSWORD = os.getenv("DB_PASSWORD", "adminpassword")
DB_NAME = os.getenv("DB_NAME", "tech_pay_scale_db")

print("=" * 60)
print("DATABASE CONNECTION TEST")
print("=" * 60)
print(f"Host: {DB_HOST}")
print(f"Port: {DB_PORT}")
print(f"User: {DB_USER}")
print(f"Database: {DB_NAME}")
print("=" * 60)

import psycopg2

max_retries = 30
retry_count = 0

while retry_count < max_retries:
    try:
        print(f"\nAttempt {retry_count + 1}/{max_retries}...")
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            dbname="postgres"  # Connect to default database first
        )
        print("✓ Connected to PostgreSQL!")
        
        # Create schemas
        cur = conn.cursor()
        schemas = ["identity", "salary", "community"]
        for schema in schemas:
            cur.execute(f"CREATE SCHEMA IF NOT EXISTS {schema};")
            print(f"✓ Schema '{schema}' created/verified")
        
        conn.commit()
        cur.close()
        
        # Now create the main database
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
        print(f"✓ Database '{DB_NAME}' created/verified")
        cur.close()
        conn.close()
        
        print("\n" + "=" * 60)
        print("✓ DATABASE INITIALIZATION SUCCESSFUL!")
        print("=" * 60)
        sys.exit(0)
        
    except Exception as e:
        retry_count += 1
        if retry_count < max_retries:
            wait_time = min(2, (retry_count // 5) + 1)
            print(f"✗ Connection failed: {type(e).__name__}")
            print(f"  Retrying in {wait_time} seconds...")
            time.sleep(wait_time)
        else:
            print(f"\n✗ Failed after {max_retries} attempts")
            print(f"Error: {e}")
            sys.exit(1)
