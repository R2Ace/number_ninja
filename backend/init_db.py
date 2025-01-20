import os

# Set the DATABASE_URL environment variable
os.environ['DATABASE_URL'] = 'postgresql://number_ninja_user:1pBGBzlcJamyVJV6Up7UBMI8OTiWxt8a@dpg-cu46a15ds78s739ou3s0-a.virginia-postgres.render.com/number_ninja'

from app import app, db

def init_database():
    with app.app_context():
        # Print database configuration
        print("ENV DB:", os.environ.get('DATABASE_URL'))
        print("App DB URI:", app.config['SQLALCHEMY_DATABASE_URI'])
        
        # Create tables
        db.create_all()
        print("Tables created successfully!")

if __name__ == '__main__':
    init_database()