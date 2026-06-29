from imagekitio import ImageKit
import psycopg2.extras
from app.models import UploadResponse, Post
from app.database import get_conn
from pathlib import Path
from dotenv import load_dotenv
import os

load_dotenv()

def upload_to_imagekit(filepath) -> UploadResponse:
    client = ImageKit(private_key=os.getenv("IMAGEKIT_PRIVATE_KEY"))

    with open(filepath, "rb") as f:
        file_data = f.read()

    file_name = Path(filepath).name
    
    response = client.files.upload(
        file=file_data,
        file_name=file_name
    )

    return UploadResponse(
        file_id=response.file_id,
        file_name=file_name,
        url=response.url,
    )

def add_to_database(post):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        """
            INSERT INTO posts (id, username, caption, url, file_id, file_type, file_name, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (post.id, post.username, post.caption, post.url, post.file_id, post.file_type, post.file_name, post.created_at)
    )
    conn.commit()
    cur.close()
    conn.close()

# Get post by username
def get_posts(username) -> list[Post]:
    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        "SELECT * FROM posts WHERE username = %s ORDER BY created_at",
        (username,)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [Post(**dict(row)) for row in rows]

# Get post by post id
def get_post_by_id(post_id: str) -> Post:
    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        "SELECT * FROM posts WHERE id = %s",
        (post_id,)
    )
    row = cur.fetchone()
    cur.close()
    conn.close()
    if row is None:
        return None
    return Post(**dict(row))

def delete_from_imagekit(file_id: str):
    client = ImageKit(private_key=os.getenv("IMAGEKIT_PRIVATE_KEY"))
    client.files.delete(file_id=file_id)

def delete_post_from_database(post_id: str):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("DELETE FROM posts WHERE id = %s", (post_id,))
    conn.commit()
    cur.close()
    conn.close()

def get_all_posts() -> list[Post]:
    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT * FROM posts ORDER BY created_at")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [Post(**dict(row)) for row in rows]