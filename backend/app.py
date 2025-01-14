from flask import Flask, request, jsonify
from flask_cors import CORS
import random
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config

app = Flask(__name__)
# Configure CORS to allow requests from http://localhost:3000 to /api/*
#CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": ["http://localhost:3000", "https://numberninja-red.vercel.app", "https://*.vercel.app", "https:localhost:*"] }}, methods=['GET', 'POST', 'OPTIONS'])
# In app.py, update the CORS configuration
CORS(app, 
    resources={r"/api/*": {
        "origins": [
            "http://localhost:3000",
            "https://numberninja-red.vercel.app"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True
    }}
)
# Configure the Flask app with the database settings
app.config.from_object(Config)
db = SQLAlchemy(app)

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
    data = request.json
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'Registration successful'}), 201

# Route to login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        return jsonify({
            'message': 'Login successful',
            'user_id': user.id,
            'username': user.username
        }), 200
    return jsonify({'error': 'Invalid username or password'}), 401

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
    top_scores = db.session.query(Score, User)\
        .join(User)\
        .order_by(Score.score.desc())\
        .limit(10)\
        .all()
    
    leaderboard = [{
        'username': score.User.username,
        'score': score.Score.score,
        'attempts': score.Score.attempts_used,
        'date': score.Score.date.strftime('%Y-%m-%d')
    } for score in top_scores]
    
    return jsonify(leaderboard)

@app.route('/api/test', methods=['GET'])
def test():
    print("Test endpoint hit!")  # This will show in your backend logs
    return jsonify({"status": "connected"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
