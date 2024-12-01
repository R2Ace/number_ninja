# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Game state (for simplicity, using in-memory storage; consider using a database for scalability)
game_state = {}

MAX_ATTEMPTS = 5

@app.route('/api/start', methods=['POST'])
def start_game():
    session_id = request.json.get('session_id')
    if not session_id:
        return jsonify({'error': 'Session ID is required.'}), 400

    game_state[session_id] = {
        'random_number': random.randint(1, 1000),
        'attempts': 0,
        'score': 0
    }
    return jsonify({'message': 'Game started.'}), 200

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

@app.route('/api/reset', methods=['POST'])
def reset_game():
    session_id = request.json.get('session_id')
    if not session_id:
        return jsonify({'error': 'Session ID is required.'}), 400

    game_state.pop(session_id, None)
    return jsonify({'message': 'Game reset.'}), 200

@app.route('/api/score', methods=['GET'])
def get_score():
    session_id = request.args.get('session_id')
    if not session_id:
        return jsonify({'error': 'Session ID is required.'}), 400

    state = game_state.get(session_id)
    if not state:
        return jsonify({'error': 'Game not started.'}), 400

    return jsonify({'score': state['score']}), 200

if __name__ == '__main__':
    app.run(debug=True)
