# backend/config.py
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    DATABASE_URL = 'postgresql://number_ninja_user:1pBGBzlcJamyVJV6Up7UBMI8OTiWxt8a@dpg-cu46a15ds78s739ou3s0-a.virginia-postgres.render.com/number_ninja'
    
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', DATABASE_URL)
    if SQLALCHEMY_DATABASE_URI.startswith('postgres://'):
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace('postgres://', 'postgresql://', 1)
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev')

    # Print configuration for debugging
    try:
        print(f"Database URI configured: {SQLALCHEMY_DATABASE_URI}")
    except Exception as e:
        print(f"Database configuration error: {e}")