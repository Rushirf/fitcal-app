# main.py

from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Annotated
import models
from database import SessionLocal, engine
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# 🟢 Load environment variables early
load_dotenv()

# 🟢 Initialize FastAPI app
app = FastAPI()
application = app  # for Elastic Beanstalk compatibility

# 🟢 Load CORS origins from environment
white_url = os.getenv("WHITE_URL", "")
white_url2 = os.getenv("WHITE_URL2", "")
print("White URL:", white_url)
print("White URL2:", white_url2)

origins = [o for o in [white_url, white_url2] if o]
print("CORS Origins:", origins)

# 🟢 Setup CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🟢 Ensure tables are created AFTER DB connection is ready
@app.on_event("startup")
def on_startup():
    print("🔧 Ensuring database tables exist...")
    models.Base.metadata.create_all(bind=engine)
    print("✅ Tables verified/created.")


# 🟢 Pydantic Schemas
class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True  # enable ORM -> response


class LoginResponse(BaseModel):
    message: str
    user_id: int
    username: str
    email: str


class UserLogin(BaseModel):
    username: str
    password: str


# 🟢 Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]

# -------------------------------
# Routes
# -------------------------------

@app.get("/")
async def read_root():
    """🟢 Health check endpoint (used by Elastic Beanstalk)"""
    return {"message": "Kudos"}


@app.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, db: db_dependency):
    # Check if username already exists
    existing_user = db.query(models.User).filter(models.User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    # Check if email already exists
    existing_email = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 🟢 Store password directly (no hashing for now)
    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=user.password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/login", response_model=LoginResponse)
async def login(user: UserLogin, db: db_dependency):
    """🟢 Login endpoint with safe error logging"""
    try:
        existing_user = db.query(models.User).filter(models.User.username == user.username).first()
        if not existing_user:
            raise HTTPException(status_code=401, detail="Invalid username or password")

        # Compare plain text passwords
        if existing_user.hashed_password != user.password:
            raise HTTPException(status_code=401, detail="Invalid username or password")

        return {
            "message": "Login successful",
            "user_id": existing_user.id,
            "username": existing_user.username,
            "email": existing_user.email
        }
    except HTTPException:
        raise
    except Exception as e:
        # 🟢 Catch unexpected DB or runtime errors to prevent 500 crashes
        print("🔥 Login error:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")

