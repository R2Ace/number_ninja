# app.py
from flask import Flask, render_template, request, redirect, url_for # type: ignore
import random

app = Flask(__name__)

# Initialize global variables
random_number = None
max_attempts = 5
attempts = 0
score = 0  # Variable for score tracking

@app.route('/', methods=['GET', 'POST'])
def index():
    global random_number, attempts, max_attempts, score

    # Initialize the random number if it's None
    if random_number is None:
        random_number = random.randint(1, 1000)
        attempts = 0

    feedback = None
    feedback_type = 'error'  # Default feedback type

    if request.method == 'POST':
        user_guess = request.form.get('guess')

        if user_guess and user_guess.isdigit():
            user_guess = int(user_guess)
            attempts += 1

            if user_guess < random_number:
                feedback = "Oops, your guess is too low!"
            elif user_guess > random_number:
                feedback = "Oops, your guess is too high!"
            else:
                feedback = "🎉 Letsssss go! You have guessed the correct number! 🎉"
                feedback_type = 'success'
                score += (max_attempts - attempts + 1)  # Example scoring
                random_number = None
                attempts = 0
                return render_template('index.html', 
                                       feedback=feedback, 
                                       feedback_type=feedback_type, 
                                       play_again=True, 
                                       score=score)

            if attempts >= max_attempts:
                feedback = f"😞 Oops, you've reached the maximum number of attempts. The correct number was {random_number}."
                feedback_type = 'error'
                random_number = None
                attempts = 0
                return render_template('index.html', 
                                       feedback=feedback, 
                                       feedback_type=feedback_type, 
                                       play_again=True, 
                                       score=score)

        else:
            feedback = "⚠️ Please enter a valid number to proceed."

    return render_template('index.html', 
                           feedback=feedback, 
                           feedback_type=feedback_type, 
                           attempts=attempts, 
                           max_attempts=max_attempts, 
                           score=score)

@app.route('/play_again', methods=['GET'])
def play_again():
    global random_number, attempts
    random_number = random.randint(1, 1000)
    attempts = 0
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
