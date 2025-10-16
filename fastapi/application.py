from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel # type: ignore
from typing import Annotated
import models
from database import SessionLocal, engine
from sqlalchemy.orm import Session # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore # fixed import
import os
from dotenv import load_dotenv # type: ignore

load_dotenv()  # load .env before using env vars

# Initialize apps
app = FastAPI()
application = app

load_dotenv()

white_url = os.getenv("WHITE_URL", "")
white_url2 = os.getenv("WHITE_URL2", "")
print("White URL:", white_url)
print("White URL2:", white_url2)

origins = [
    white_url,
    white_url2,
]
# remove empty values
origins = [o for o in origins if o]

print("CORS Origins:", origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # allow all origins for simplicity; replace with origins for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
models.Base.metadata.create_all(bind=engine)

# Schemas
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

# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

# Routes
@app.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, db: db_dependency):
    # Check if username already exists
    existing_user = db.query(models.User).filter(models.User.username == user.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    # Check if email already exists
    existing_email = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Store password directly (not hashed)
    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=user.password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/")
async def read_root():
    return {"message": "Kudos"}

@app.post("/login", response_model=LoginResponse)
async def login(user: UserLogin, db: db_dependency):
    # Check if user exists
    existing_user = db.query(models.User).filter(models.User.username == user.username).first()
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    # Compare plain-text passwords
    if existing_user.hashed_password != user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    return {
        "message": "Login successful",
        "user_id": existing_user.id,
        "username": existing_user.username,
        "email": existing_user.email
    }
       
