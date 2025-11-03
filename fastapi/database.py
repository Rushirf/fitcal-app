from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
from urllib.parse import quote_plus
import boto3, json, os, time

# --- Get DB config ---
DB_SECRET_ARN = os.getenv("DB_SECRET_ARN")
DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")

# --- Fetch secret from AWS Secrets Manager ---
def get_secret():
    client = boto3.client("secretsmanager", region_name="us-east-1")
    response = client.get_secret_value(SecretId=DB_SECRET_ARN)
    secret = json.loads(response["SecretString"])
    return secret["username"], secret["password"]

DB_USER, DB_PASSWORD = get_secret()

# --- URL encode password in case of special chars ---
DB_PASSWORD = quote_plus(DB_PASSWORD)

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

# --- Create engine with retries ---
for attempt in range(5):
    try:
        engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,
            pool_recycle=280,
            pool_size=5,
            max_overflow=10,
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
