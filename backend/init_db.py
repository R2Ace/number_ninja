# Create init_db.py in backend folder
from app import app, db

def init_database():
    with app.app_context():
        db.create_all()
        print("Database tables created successfully!")

if __name__ == "__main__":
    init_database()