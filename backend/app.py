from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import os
import secrets
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from flask_mail import Mail, Message

# Initialize the Flask app
app = Flask(__name__)

# CORS configuration
CORS(app, 
    resources={r"/api/*": {
        "origins": [
            "http://localhost:3000",
            "https://numberninja-red.vercel.app",
            "https://numberninja-rho.vercel.app",
            "https://numberninja-*.vercel.app",
            "https://numberninjas.com",
            "https://www.numberninjas.com",
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }}
)

# Configure the Flask app with the database and JWT settings
app.config.from_object(Config)

# Initialize the Flask-JWT-Extended extension
jwt = JWTManager(app)

# Initialize database
db = SQLAlchemy(app)
print("Flask running with DB URI:", app.config['SQLALCHEMY_DATABASE_URI'])

# Initialize the Flask-Migrate extension
migrate = Migrate(app, db)

# Setup Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Adjust for your mail provider
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME', 'your-email@gmail.com')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD', 'your-app-password')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER', 'noreply@numberninjas.com')
mail = Mail(app)

# Database models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    reset_token = db.Column(db.String(100), nullable=True)
    reset_token_expiry = db.Column(db.DateTime, nullable=True)
    scores = db.relationship('Score', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
        
    def set_reset_token(self):
        self.reset_token = secrets.token_urlsafe(32)
        self.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)
        return self.reset_token
        
    def is_reset_token_valid(self):
        return self.reset_token_expiry and self.reset_token_expiry > datetime.utcnow()

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer, nullable=False)
    attempts_used = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


# Game state (for simplicity, using in-memory storage; consider using a database for scalability)
game_state = {}
MAX_ATTEMPTS = 5


# API routes

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello from Flask!"}), 200

# Route for the home page
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to the Number Ninja API"}), 200

# Route to start a new game
@app.route('/api/start', methods=['POST'])
def start_game():
    print("Received request to /api/start")
    session_id = request.json.get('session_id')
    if not session_id:
        return jsonify({'error': 'Session ID is required.'}), 400

    game_state[session_id] = {
        'random_number': random.randint(1, 1000),
        'attempts': 0,
        'score': 0
    }
    return jsonify({'message': 'Game started.'}), 200

# Route to make a guess
@app.route('/api/guess', methods=['POST'])
def make_guess():
    session_id = request.json.get('session_id')
    user_guess = request.json.get('guess')

    if not session_id or user_guess is None:
        return jsonify({'error': 'Session ID and guess are required.'}), 400

    state = game_state.get(session_id)
    if not state:
        return jsonify({'error': 'Game not started. Please start a new game.'}), 400

    state['attempts'] += 1

    if user_guess < state['random_number']:
        feedback = "Too low!"
        feedback_type = 'error'
    elif user_guess > state['random_number']:
        feedback = "Too high!"
        feedback_type = 'error'
    else:
        feedback = "Congratulations! You've guessed the correct number!"
        feedback_type = 'success'
        state['score'] += (MAX_ATTEMPTS - state['attempts'] + 1)
        # Optionally, reset the game or keep the state for high scores
        return jsonify({
            'feedback': feedback,
            'feedback_type': feedback_type,
            'score': state['score'],
            'game_over': True
        }), 200

    if state['attempts'] >= MAX_ATTEMPTS:
        feedback = f"Game over! The correct number was {state['random_number']}."
        feedback_type = 'danger'
        return jsonify({
            'feedback': feedback,
            'feedback_type': feedback_type,
            'game_over': True
        }), 200

    return jsonify({
        'feedback': feedback,
        'feedback_type': feedback_type,
        'attempts': state['attempts'],
        'max_attempts': MAX_ATTEMPTS
    }), 200

# Route to reset the game
@app.route('/api/reset', methods=['POST'])
def reset_game():
    session_id = request.json.get('session_id')
    if not session_id:
        return jsonify({'error': 'Session ID is required.'}), 400

    game_state.pop(session_id, None)
    return jsonify({'message': 'Game reset.'}), 200

# Route to get the current score
@app.route('/api/score', methods=['GET'])
def get_score():
    session_id = request.args.get('session_id')
    if not session_id:
        return jsonify({'error': 'Session ID is required.'}), 400

    state = game_state.get(session_id)
    if not state:
        return jsonify({'error': 'Game not started.'}), 400

    return jsonify({'score': state['score']}), 200

# Route to register a new user
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        print("Register data received:", data)  # Debug log
        
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username exists'}), 400
            
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
            
        user = User(username=data['username'], email=data['email'])
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        print("User registered successfully")  # Debug log
        
        return jsonify({
            'message': 'Registration successful',
            'user_id': user.id,
            'username': user.username
        }), 201
        
    except Exception as e:
        print(f"Registration error: {str(e)}")  # Error log
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Updated login route with JWT
@app.route('/api/login', methods=['POST'])
def login():
    try:
        print("Database URL:", app.config['SQLALCHEMY_DATABASE_URI'])
        data = request.json
        print("Login attempt:", data.get('username', ''))
        
        if not data or 'username' not in data or 'password' not in data:
            print("Missing credentials")
            return jsonify({'error': 'Missing username or password'}), 400
        
        user = User.query.filter_by(username=data['username']).first()
        if user and user.check_password(data['password']):
            print(f"Successful login for user: {user.username}")
            
            # Create JWT tokens
            access_token = create_access_token(identity=user.id)
            refresh_token = create_refresh_token(identity=user.id)
            
            return jsonify({
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'access_token': access_token,
                'refresh_token': refresh_token
            }), 200
        else:
            print(f"Failed login attempt for username: {data.get('username', '')}")
            return jsonify({'error': 'Invalid username or password'}), 401
            
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
# Refresh token endpoint
@app.route('/api/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    access_token = create_access_token(identity=current_user_id)
    return jsonify({
        'access_token': access_token,
        'user_id': user.id,
        'username': user.username
    }), 200

# User profile endpoint
@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    return jsonify({
        'user_id': user.id,
        'username': user.username,
        'email': user.email
    }), 200

# Request password reset endpoint
@app.route('/api/password-reset/request', methods=['POST'])
def request_password_reset():
    try:
        data = request.json
        if not data or 'email' not in data:
            return jsonify({'error': 'Email is required'}), 400
            
        user = User.query.filter_by(email=data['email']).first()
        if not user:
            # Don't reveal if email exists for security reasons
            return jsonify({'message': 'If your email is registered, you will receive a reset link'}), 200
            
        # Generate and save reset token
        token = user.set_reset_token()
        db.session.commit()
        
        # Send email with reset link
        reset_url = f"https://numberninjas.com/reset-password?token={token}"
        # For development, also print the URL
        print(f"Password reset URL for {user.username}: {reset_url}")
        
        msg = Message(
            "Password Reset - Number Ninja",
            recipients=[user.email]
        )
        msg.body = f"""
        Hello {user.username},
        
        We received a request to reset your Number Ninja password.
        
        Click the link below to reset your password:
        {reset_url}
        
        This link will expire in 1 hour.
        
        If you didn't request this reset, you can safely ignore this email.
        
        The Number Ninja Team
        """
        mail.send(msg)
        
        return jsonify({'message': 'If your email is registered, you will receive a reset link'}), 200
    except Exception as e:
        print(f"Password reset request error: {str(e)}")
        return jsonify({'error': 'Unable to process your request'}), 500

# Reset password endpoint
@app.route('/api/password-reset/reset', methods=['POST'])
def reset_password():
    try:
        data = request.json
        if not data or 'token' not in data or 'new_password' not in data:
            return jsonify({'error': 'Token and new password are required'}), 400
            
        user = User.query.filter_by(reset_token=data['token']).first()
        if not user or not user.is_reset_token_valid():
            return jsonify({'error': 'Invalid or expired token'}), 400
            
        # Update password and clear token
        user.set_password(data['new_password'])
        user.reset_token = None
        user.reset_token_expiry = None
        db.session.commit()
        
        return jsonify({'message': 'Password reset successful'}), 200
    except Exception as e:
        print(f"Password reset error: {str(e)}")
        return jsonify({'error': 'Unable to reset password'}), 500

# Save score endpoint
@app.route('/api/scores', methods=['POST'])
def save_score():
    try:
        data = request.json
        print("Saving score:", data)  # Debug log
        
        if not all(key in data for key in ['score', 'attempts', 'user_id']):
            return jsonify({'error': 'Missing required data'}), 400
            
        new_score = Score(
            score=data['score'],
            attempts_used=data['attempts'],
            user_id=data['user_id']
        )
        db.session.add(new_score)
        db.session.commit()
        print(f"Score saved successfully for user {data['user_id']}")  # Debug log
        
        return jsonify({'message': 'Score saved'}), 201
    except Exception as e:
        print(f"Error saving score: {str(e)}")  # Error log
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Leaderboard endpoint
@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    try:
        top_scores = Score.query \
        .join(User) \
        .order_by(Score.score.desc()) \
        .limit(10) \
        .all()

        leaderboard = [{
            'username': item.user.username,
            'score': item.score,
            'attempts': item.attempts_used,
            'date': item.date.strftime('%Y-%m-%d')
        } for item in top_scores]

        return jsonify(leaderboard), 200
    except Exception as e:
        print(f"Error fetching leaderboard: {str(e)}")
        return jsonify({'error': 'Failed to fetch leaderboard'}), 500

# Seed data endpoint
@app.route('/api/seed', methods=['GET'])
def seed_data():
    try:
        # Check if users already exist
        existing_john = User.query.filter_by(username='JohnDoe').first()
        existing_jane = User.query.filter_by(username='JaneDoe').first()
        if existing_john or existing_jane:
            return jsonify({'message': 'Seed data already created'}), 200

        # Create two users
        user1 = User(username='JohnDoe', email='john@example.com')
        user1.set_password('john123')  # or any password
        user2 = User(username='JaneDoe', email='jane@example.com')
        user2.set_password('jane123')

        db.session.add_all([user1, user2])
        db.session.commit()

        return jsonify({'message': 'Seed data created with 2 users'}), 201
    except Exception as e:
        print(f"Error seeding data: {str(e)}")
        db.session.rollback()
        return jsonify({'error': f'Failed to seed data: {str(e)}'}), 500

# Test endpoint
@app.route('/api/test', methods=['GET'])
def test():
    print("Test endpoint hit!")  # This will show in your backend logs
    return jsonify({"status": "connected"}), 200

# Database test endpoint
@app.route('/api/db-test', methods=['GET'])
def test_db():
    try:
        # Try to make a simple query
        user_count = User.query.count()
        return jsonify({
            "status": "connected",
            "user_count": user_count
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    
# User history endpoint
@app.route('/api/user/history', methods=['GET'])
def get_user_history():
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400

        user_scores = Score.query\
            .filter_by(user_id=user_id)\
            .order_by(Score.date.desc())\
            .all()

        history = [{
            'score': score.score,
            'attempts': score.attempts_used,
            'date': score.date.strftime('%Y-%m-%d %H:%M'),
        } for score in user_scores]

        # Add summary statistics
        total_games = len(history)
        if total_games > 0:
            avg_score = sum(game['score'] for game in history) / total_games
            avg_attempts = sum(game['attempts'] for game in history) / total_games
        else:
            avg_score = 0
            avg_attempts = 0

        return jsonify({
            'history': history,
            'stats': {
                'total_games': total_games,
                'average_score': round(avg_score, 2),
                'average_attempts': round(avg_attempts, 2)
            }
        }), 200

    except Exception as e:
        print(f"Error fetching game history: {str(e)}")
        return jsonify({'error': 'Failed to fetch game history'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)