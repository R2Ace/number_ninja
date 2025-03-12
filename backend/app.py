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
from datetime import date
import hashlib

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
    difficulty = db.Column(db.String(20), default='ninja') 
    max_number = db.Column(db.Integer, default=1000)    

# Database models
class DailyChallenge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    attempts_used = db.Column(db.Integer, nullable=False)
    challenge_date = db.Column(db.Date, nullable=False)
    
    __table_args__ = (db.UniqueConstraint('user_id', 'challenge_date'),)


# Game state (for simplicity, using in-memory storage; consider using a database for scalability)
game_state = {}
MAX_ATTEMPTS = 5

# Initialize rate limiter
limiter = Limiter(
    get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)
limiter.init_app(app)


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
    try:
        print("Received request to /api/start")
        data = request.json
        print("Request data:", data)
        
        session_id = data.get('session_id')
        if not session_id:
            print("Error: Missing session_id")
            return jsonify({'error': 'Session ID is required.'}), 400
            
        # Validate session_id format
        if not isinstance(session_id, str) or len(session_id) < 5:
            print(f"Invalid session_id format: {session_id}")
            return jsonify({'error': 'Invalid session ID format.'}), 400
        
        # Get difficulty settings with type conversion and defaults
        try:
            max_number = int(data.get('max_number', 1000))
            max_attempts = int(data.get('max_attempts', 5))
            difficulty = str(data.get('difficulty', 'ninja'))
            
            # Validate ranges with safe defaults
            if max_number <= 0 or max_number > 100000:  # Upper limit for safety
                print(f"Invalid max_number ({max_number}), using default 1000")
                max_number = 1000
                
            if max_attempts <= 0 or max_attempts > 20:  # Upper limit for safety
                print(f"Invalid max_attempts ({max_attempts}), using default 5")
                max_attempts = 5
                
            print(f"Game settings: difficulty={difficulty}, max_number={max_number}, max_attempts={max_attempts}")
        except (TypeError, ValueError) as e:
            print(f"Error parsing game settings: {e}")
            # Set defaults if conversion fails
            max_number = 1000
            max_attempts = 5
            difficulty = 'ninja'
        
        # Generate random number based on the max_number
        random_number = random.randint(1, max_number)
        print(f"Generated random number: {random_number} (1-{max_number})")
        
        # Create or update game state
        game_state[session_id] = {
            'random_number': random_number,
            'attempts': 0,
            'score': 0,
            'max_attempts': max_attempts,
            'difficulty': difficulty,
            'max_number': max_number,
            'started_at': datetime.utcnow().isoformat()  # Add timestamp for debugging
        }
        
        print(f"Game state created for session {session_id}: {game_state[session_id]}")
        
        return jsonify({
            'message': 'Game started.',
            'session_id': session_id,  # Echo back the session_id for verification
            'difficulty': difficulty,
            'max_attempts': max_attempts,
            'max_number': max_number
        }), 200
    except Exception as e:
        print(f"Unexpected error in start_game: {str(e)}")
        return jsonify({'error': 'Server error starting game.'}), 500

# Update the make_guess function with rate limiting and enhanced validation
@app.route('/api/guess', methods=['POST'])
@limiter.limit("10 per minute")  # Rate limit: 10 guesses per minute
def make_guess():
    try:
        print("Received request to /api/guess")
        data = request.json
        print("Request data:", data)
        
        session_id = data.get('session_id')
        user_guess = data.get('guess')

        if not session_id:
            print("Error: Missing session_id")
            return jsonify({
                'error': 'Session ID is required.',
                'feedback': 'Game session error. Please start a new game.',
                'feedback_type': 'error'
            }), 400
            
        if user_guess is None:
            print("Error: Missing guess")
            return jsonify({
                'error': 'Guess is required.',
                'feedback': 'Please enter a number to guess.',
                'feedback_type': 'error'
            }), 400

        # Get game state
        state = game_state.get(session_id)
        if not state:
            print(f"Error: Game not found for session {session_id}")
            return jsonify({
                'error': 'Game not started or session expired.',
                'feedback': 'Game session not found. Please start a new game.',
                'feedback_type': 'error',
                'game_over': True  # Mark as game over to prompt new game
            }), 400

        print(f"Game state for session {session_id}: {state}")
        
        # Get max attempts from state with fallback
        max_attempts = state.get('max_attempts', MAX_ATTEMPTS)
        
        # *** IMPORTANT CHANGE: Return a normal 200 status for max attempts ***
        # Verify this isn't too many attempts
        if state['attempts'] >= max_attempts:
            return jsonify({
                'error': 'Maximum attempts reached.',
                'feedback': f"Game over! The correct number was {state['random_number']}.",
                'feedback_type': 'error',
                'game_over': True,
                'attempts': state['attempts'],
                'max_attempts': max_attempts
            }), 200  # Changed from 400 to 200

        # Verify the guess is within valid range
        max_number = state.get('max_number', 1000)
        try:
            user_guess = int(user_guess)
            if not (1 <= user_guess <= max_number):
                print(f"Error: Guess {user_guess} out of range 1-{max_number}")
                return jsonify({
                    'error': f'Guess must be between 1 and {max_number}.',
                    'feedback': f'Please enter a number between 1 and {max_number}.',
                    'feedback_type': 'error',
                    'attempts': state['attempts'],  # Return current attempts for UI
                    'max_attempts': max_attempts
                }), 400
        except (TypeError, ValueError):
            print(f"Error: Invalid guess format {user_guess}")
            return jsonify({
                'error': 'Guess must be a number.',
                'feedback': 'Please enter a valid number.',
                'feedback_type': 'error',
                'attempts': state['attempts'],  # Return current attempts for UI
                'max_attempts': max_attempts
            }), 400

        # Increment attempts
        state['attempts'] += 1
        current_attempts = state['attempts']
        
        # Check if winning
        if user_guess == state['random_number']:
            # Calculate score based on attempts and difficulty
            difficulty_multiplier = {
                'rookie': 1,
                'ninja': 2,
                'master': 3,
                'grandmaster': 4,
                'legendary': 5
            }.get(state.get('difficulty', 'ninja'), 2)
            
            # Base score calculation
            calculated_score = (max_attempts - current_attempts + 1) * difficulty_multiplier * 10
            state['score'] = calculated_score
            
            return jsonify({
                'feedback': "Congratulations! You've guessed the correct number!",
                'feedback_type': 'success',
                'score': calculated_score,
                'attempts': current_attempts,
                'max_attempts': max_attempts,
                'game_over': True
            }), 200
        
        # Check if too many attempts
        if current_attempts >= max_attempts:
            return jsonify({
                'feedback': f"Game over! The correct number was {state['random_number']}.",
                'feedback_type': 'error',
                'attempts': current_attempts,
                'max_attempts': max_attempts,
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
            'attempts': current_attempts,
            'max_attempts': max_attempts
        }), 200
    except Exception as e:
        print(f"Error processing guess: {str(e)}")
        return jsonify({
            'error': 'An error occurred processing your guess.',
            'feedback': 'Server error. Please try again.',
            'feedback_type': 'error'
        }), 500

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
        user_id=data['user_id'],
        difficulty=data.get('difficulty', 'ninja'),
        max_number=data.get('max_number', 1000)
    )
    db.session.add(new_score)
    db.session.commit()
    return jsonify({'message': 'Score saved'}), 201

# Route to get the leaderboard
@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    difficulty = request.args.get('difficulty')
    
    query = Score.query.join(User)
    
    # Filter by difficulty if provided
    if difficulty:
        query = query.filter(Score.difficulty == difficulty)
    
    top_scores = query.order_by(Score.score.desc()).limit(10).all()

    leaderboard = [{
        'username': item.user.username,
        'score': item.score,
        'attempts': item.attempts_used,
        'date': item.date.strftime('%Y-%m-%d'),
        'difficulty': item.difficulty
    } for item in top_scores]

    return jsonify(leaderboard), 200

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
    

# Daily challenge generation
@app.route('/api/daily-challenge/start', methods=['POST'])
def start_daily_challenge():
    try:
        user_id = request.json.get('user_id')
        
        # Generate a consistent number based on date
        today = date.today().strftime('%Y%m%d')
        seed = int(hashlib.md5(today.encode()).hexdigest(), 16) % 10000
        random.seed(seed)
        daily_number = random.randint(1, 1000)
        random.seed()  # Reset the seed
        
        session_id = f"daily_{today}_{user_id if user_id else 'guest'}"
        
        # Check if user already completed today's challenge
        if user_id:
            existing_score = DailyChallenge.query.filter_by( 
                user_id=user_id, 
                challenge_date=date.today()
            ).first()
            
            if existing_score:
                return jsonify({
                    'error': 'You have already completed today\'s challenge',
                    'score': existing_score.score,
                    'attempts': existing_score.attempts_used
                }), 400
        
        # Create game state
        game_state[session_id] = {
            'random_number': daily_number,
            'attempts': 0,
            'score': 0,
            'is_daily': True
        }
        
        return jsonify({
            'message': 'Daily challenge started',
            'session_id': session_id
        }), 200
    except Exception as e:
        print(f"Error starting daily challenge: {str(e)}")
        return jsonify({'error': 'Failed to start daily challenge'}), 500

# Save daily challenge score
@app.route('/api/daily-challenge/save', methods=['POST'])
def save_daily_challenge():
    try:
        data = request.json
        print("Daily challenge save data:", data)  # Debug log
        
        user_id = data.get('user_id')
        session_id = data.get('session_id')
        
        if not user_id or not session_id:
            return jsonify({'error': 'User ID and session ID are required'}), 400
            
        state = game_state.get(session_id)
        print("Game state:", state)  # Debug log
        
        if not state or not state.get('is_daily'):
            return jsonify({'error': 'Invalid session or not a daily challenge'}), 400
            
        # Create or update daily challenge record
        new_challenge = DailyChallenge(
            user_id=user_id,
            score=state['score'],
            attempts_used=state['attempts'],
            challenge_date=date.today()
        )
        
        db.session.add(new_challenge)
        db.session.commit()
        print("Daily challenge score saved successfully")  # Debug log
        
        return jsonify({'message': 'Daily challenge score saved'}), 201
    except Exception as e:
        print(f"Error saving daily challenge: {str(e)}")  # Error log
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Get daily leaderboard
@app.route('/api/daily-challenge/leaderboard', methods=['GET'])
def get_daily_leaderboard():
    today = date.today()
    
    top_scores = DailyChallenge.query \
        .filter_by(challenge_date=today) \
        .join(User) \
        .order_by(DailyChallenge.score.desc()) \
        .limit(10) \
        .all()
        
    leaderboard = [{
        'username': item.user.username,
        'score': item.score,
        'attempts': item.attempts_used,
        'date': item.challenge_date.strftime('%Y-%m-%d')
    } for item in top_scores]
    
    return jsonify(leaderboard), 200




















if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
