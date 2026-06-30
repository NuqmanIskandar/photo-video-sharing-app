from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from contextlib import asynccontextmanager
from app.database import init_db, create_user
from app.models import UserCreate, UserPublic, Token, Post
from app.users import hash_password, authenticate_user, create_access_token, get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from app.posts import upload_to_imagekit,add_to_database, get_posts, get_post_by_id, delete_from_imagekit, delete_post_from_database, get_all_posts
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
import os, shutil, tempfile, uuid

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(title="Photo Video Sharing App", lifespan=lifespan)

origins = [
    "http://localhost:5173",
    "https://photo-video-sharing-app.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*']
)

@app.get("/")
def root():
    return {"message": "FastAPI is running..."}

@app.post("/register", status_code=201, summary="Create a new user")
def register_user(body: UserCreate):
    hashed = hash_password(body.password)
    create_user(body.username, hashed, body.full_name or "")
    return {"message": "User registered successfully."}

@app.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token({"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}

# Create a Post
@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    caption: str = Form(...),
    user: UserPublic = Depends(get_current_user)
):
    # Save the uploaded file to a temp location on disk
    suffix = os.path.splitext(file.filename)[1] # Keep original extension
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name
    try:
        upload_result = upload_to_imagekit(tmp_path)
    finally:
        os.remove(tmp_path) # clean up temp file regardless of success/failure
    
    post = Post(
        id = str(uuid.uuid4()),
        username = user.username,
        caption = caption,
        url = upload_result.url,
        file_id=upload_result.file_id,
        file_type = "video" if (file.content_type or "").startswith("video/") else "image",
        file_name =  upload_result.file_name,
        created_at = datetime.now()
    )

    try:
        add_to_database(post)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to save post") from e

    return post

# Show the user's posts
@app.get("/posts", response_model=list[Post])
async def get_my_posts(user: UserPublic = Depends(get_current_user)):
    return get_posts(user.username)

# Show the feed (everyone posts)
@app.get("/feed")
async def get_feed():
    return get_all_posts()

# Delete a user's post
@app.delete("/posts/{post_id}")
async def delete_post(post_id: str, user: UserPublic = Depends(get_current_user)):
    post = get_post_by_id(post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.username != user.username:
        raise HTTPException(status_code=403, detail="Not authorized to delete this post")
    delete_from_imagekit(post.file_id)
    delete_post_from_database(post_id)
    return {"detail": "Post deleted"}

# Testing
@app.get("/me", response_model=UserPublic, summary="Get my profile (protected)")
def read_me(current_user: UserPublic = Depends(get_current_user)):
    return current_user