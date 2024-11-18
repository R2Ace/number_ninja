from flask import Flask, render_template, request, redirect, url_for # type: ignore
import random

app = Flask(__name__)

random_number = None
max_attempts = 5
attempts = 0

@app.route('/', methods=['GET', 'POST'])
def index():
    global random_number, attempts, max_attempts

    if request.method == 'POST':
        user_guess = request.form.get('guess')
        if user_guess.isdigit():
            user_guess = int(user_guess)
            attempts += 1

            if user_guess < random_number:
                feedback = "Oops, your guess is too low"
            elif user_guess > random_number:
                feedback = "Oops, your guess is too high"
            else:
                feedback = "Letsssss go, You have guessed the correct number"
                random_number = None  # Reset the game
                attempts = 0
                return render_template('index.html', feedback=feedback, play_again=True)

            if attempts == max_attempts:
                feedback = f"Oops, you have reached the maximum number of attempts. The correct number was {random_number}"
                random_number = None  # Reset the game
                attempts = 0
                return render_template('index.html', feedback=feedback, play_again=True)

            return render_template('index.html', feedback=feedback, attempts=attempts, max_attempts=max_attempts)
        else:
            feedback = "Oops, it's okay. Enter a number to proceed"
            return render_template('index.html', feedback=feedback, attempts=attempts, max_attempts=max_attempts)

    if random_number is None:
        random_number = random.randint(1, 100)
        attempts = 0

    return render_template('index.html', attempts=attempts, max_attempts=max_attempts)

@app.route('/play_again')
def play_again():
    global random_number, attempts
    random_number = random.randint(1, 100)
    attempts = 0
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)