from flask import Flask, request, jsonify
from flask_cors import CORS
import random
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config
from flask_migrate import Migrate
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = Flask(__name__)
# Configure CORS to allow requests from http://localhost:3000 to /api/*
#CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": ["http://localhost:3000", "https://numberninja-red.vercel.app", "https://*.vercel.app", "https:localhost:*"] }}, methods=['GET', 'POST', 'OPTIONS'])
# In app.py, update the CORS configuration
CORS(app, 
    resources={r"/api/*": {
        "origins": [
            "http://localhost:3000",
            "https://numberninja-red.vercel.app",
            "https://numberninja-rho.vercel.app",
            "https://numberninja-*.vercel.app",
            "https://numbersninjas.com",
            "https://www.numbersninjas.com"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],  # Added Authorization for JWT
        "supports_credentials": True
    }}
)
# Configure the Flask app with the database settings
app.config.from_object(Config)
db = SQLAlchemy(app)
print("Flask running with DB URI:", app.config['SQLALCHEMY_DATABASE_URI'])

# Initialize the Flask-Migrate extension
migrate = Migrate(app, db)

# Database models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    scores = db.relationship('Score', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer, nullable=False)
    attempts_used = db.Column(db.Integer, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


# Game state (for simplicity, using in-memory storage; consider using a database for scalability)
game_state = {}
MAX_ATTEMPTS = 5

# Initialize rate limiter
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)


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

# Update the make_guess function with rate limiting and enhanced validation
@app.route('/api/guess', methods=['POST'])
@limiter.limit("10 per minute")  # Rate limit: 10 guesses per minute
def make_guess():
    try:
        session_id = request.json.get('session_id')
        user_guess = request.json.get('guess')

        if not session_id or user_guess is None:
            return jsonify({'error': 'Session ID and guess are required.'}), 400

        # Get game state
        state = game_state.get(session_id)
        if not state:
            return jsonify({'error': 'Game not started. Please start a new game.'}), 400

        # Verify this isn't too many attempts
        if state['attempts'] >= MAX_ATTEMPTS:
            return jsonify({'error': 'Maximum attempts reached.'}), 400

        # Verify the guess is within valid range
        if not (1 <= user_guess <= 1000):
            return jsonify({'error': 'Guess must be between 1 and 1000.'}), 400

        # Increment attempts
        state['attempts'] += 1
        
        # Record this guess to prevent duplicates
        state.setdefault('previous_guesses', []).append(user_guess)
        
        # Check if winning
        if user_guess == state['random_number']:
            # Calculate score based on attempts - verify it's correct
            calculated_score = MAX_ATTEMPTS - state['attempts'] + 1
            state['score'] = calculated_score
            
            return jsonify({
                'feedback': "Congratulations! You've guessed the correct number!",
                'feedback_type': 'success',
                'score': calculated_score,
                'game_over': True
            }), 200
        
        # Check if too many attempts
        if state['attempts'] >= MAX_ATTEMPTS:
            return jsonify({
                'feedback': f"Game over! The correct number was {state['random_number']}.",
                'feedback_type': 'danger',
                'game_over': True
            }), 200
        
        # Provide hint
        if user_guess < state['random_number']:
            feedback = "Too low!"
            feedback_type = 'error'
        else:
            feedback = "Too high!"
            feedback_type = 'error'

        return jsonify({
            'feedback': feedback,
            'feedback_type': feedback_type,
            'attempts': state['attempts'],
            'max_attempts': MAX_ATTEMPTS
        }), 200
    except Exception as e:
        print(f"Error processing guess: {str(e)}")
        return jsonify({'error': 'An error occurred processing your guess.'}), 500

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

# Route to login
@app.route('/api/login', methods=['POST'])
def login():
    try:
        print("Database URL:", app.config['SQLALCHEMY_DATABASE_URI'])
        data = request.json
        print("Login attempt:", data['username'])
        
        if not data or 'username' not in data or 'password' not in data:
            print("Missing credentials")
            return jsonify({'error': 'Missing username or password'}), 400
        
        user = User.query.filter_by(username=data['username']).first()
        if user and user.check_password(data['password']):
            print(f"Successful login for user: {user.username}")
            return jsonify({
                'user_id': user.id,
                'username': user.username,
                'email': user.email
            }), 200
        else:
            print(f"Failed login attempt for username: {data['username']}")
            return jsonify({'error': 'Invalid username or password'}), 401
            
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Route to save a score
@app.route('/api/scores', methods=['POST'])
def save_score():
    data = request.json
    new_score = Score(
        score=data['score'],
        attempts_used=data['attempts'],
        user_id=data['user_id']
    )
    db.session.add(new_score)
    db.session.commit()
    return jsonify({'message': 'Score saved'}), 201

# Route to get the leaderboard
@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
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

    return jsonify(leaderboard)

#Seeding the database with some test data
@app.route('/api/seed', methods=['GET'])
def seed_data():
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


@app.route('/api/test', methods=['GET'])
def test():
    print("Test endpoint hit!")  # This will show in your backend logs
    return jsonify({"status": "connected"}), 200

# Add this route to app.py to test database
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
    
# Route to get user history
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
