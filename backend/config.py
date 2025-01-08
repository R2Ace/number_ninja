# backend/config.py
class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql://localhost/number_ninja'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'dev'  # Change this to a random string for production