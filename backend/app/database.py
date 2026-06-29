import psycopg2
import psycopg2.extras
from typing import Optional
from fastapi import HTTPException
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def get_conn():
    conn = psycopg2.connect(DATABASE_URL)
    return conn

def init_db():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            username TEXT PRIMARY KEY,
            hashed_password TEXT NOT NULL,
            full_name TEXT
        )
    """)
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS posts (
            id TEXT PRIMARY KEY,
            username TEXT REFERENCES users(username),
            caption TEXT NOT NULL,
            url TEXT NOT NULL,
            file_id TEXT NOT NULL,
            file_type TEXT NOT NULL,
            file_name TEXT NOT NULL,
            created_at TIMESTAMP
        )
    """)
    conn.commit()
    cur.close()
    conn.close()

def get_user(username: str) -> Optional[dict]:
    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        "SELECT username, hashed_password, full_name FROM users WHERE username = %s",
        (username,)
    )
    row = cur.fetchone()
    cur.close()
    conn.close()
    if row:
        return {"username": row["username"], "hashed_password": row["hashed_password"], "full_name": row["full_name"]}
    return None

def create_user(username: str, hashed_password: str, full_name: str = ""):
    conn = get_conn()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO users (username, hashed_password, full_name) VALUES (%s, %s, %s)",
            (username, hashed_password, full_name)
        )
        conn.commit()
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        raise HTTPException(status_code=409, detail="Username already taken")
    finally:
        cur.close()
        conn.close()