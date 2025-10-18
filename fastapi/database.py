# from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker
# import os
# from dotenv import load_dotenv

# load_dotenv()

# DB_USER = os.getenv("DB_USER")
# DB_PASSWORD = os.getenv("DB_PASSWORD")
# DB_HOST = os.getenv("DB_HOST")
# DB_NAME = os.getenv("DB_NAME")

# # SQLAlchemy connection string
# DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

# engine = create_engine(DATABASE_URL)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Base = declarative_base()

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os, time
from dotenv import load_dotenv
from sqlalchemy.exc import OperationalError

load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

# --- NEW: add connection pool safety and retry logic ---
for attempt in range(5):
    try:
        engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,     # ✅ Detect and reconnect dropped connections
            pool_recycle=280,       # ✅ Refresh stale connections before RDS timeout (300s default)
            pool_size=5,            # ✅ Reasonable for EB
            max_overflow=10,        # ✅ Allow bursts
        )
        with engine.connect() as conn:
            print("✅ Database connection successful")
        break
    except OperationalError as e:
        print(f"⚠️ Database connection failed (attempt {attempt+1}/5): {e}")
        time.sleep(3)
else:
    raise RuntimeError("❌ Could not connect to the database after 5 attempts")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
