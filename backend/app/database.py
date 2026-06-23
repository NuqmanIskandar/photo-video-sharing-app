import sqlite3
from typing import Optional
from fastapi import HTTPException

DB_PATH = "photo_video.db"

def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    conn = get_conn()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            username TEXT PRIMARY KEY,
            hashed_password TEXT NOT NULL,
            full_name TEXT
        )
    """)
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS posts (
            id TEXT PRIMARY KEY,
            username TEXT REFERENCES users(username),
            caption TEXT NOT NULL,
            url TEXT NOT NULL,
            file_id TEXT NOT NULL,
            file_type TEXT NOT NULL,
            file_name TEXT NOT NULL,
            created_at DATETIME
        )
    """)
    conn.commit()
    conn.close()

def get_user(username: str) -> Optional[dict]:
    conn = get_conn()
    row = conn.execute(
        "SELECT username, hashed_password, full_name FROM users WHERE username = ?",
        (username,)
    ).fetchone()
    conn.close()
    if row:
        return {"username": row["username"], "hashed_password": row["hashed_password"], "full_name": row["full_name"]}
    return None

def create_user(username: str, hashed_password: str, full_name: str = ""):
    conn = get_conn()
    try:
        conn.execute(
            "INSERT INTO users (username, hashed_password, full_name) VALUES (?, ?, ?)",
            (username, hashed_password, full_name)
        )
        conn.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=409, detail="Username already taken")
    finally:
        conn.close()

