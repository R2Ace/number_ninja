# Remove the hard-coded key
import os
# Set up any environment variables needed before importing app
os.environ.setdefault('STRIPE_SECRET_KEY', '')  # Empty string here, use .env file

# Now import the app
from app import app

if __name__ == "__main__":
    app.run()