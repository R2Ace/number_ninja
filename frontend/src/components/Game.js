// frontend/src/components/Game.js
import React, { useState, useEffect } from 'react';
import { startGame, makeGuess, resetGame } from '../services/api';
import successSound from '../assets/success.mp3';
import errorSound from '../assets/error.mp3';

const Game = () => {
    const [sessionId, setSessionId] = useState(null);
    const [guess, setGuess] = useState('');
    const [feedback, setFeedback] = useState('');
    const [feedbackType, setFeedbackType] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [maxAttempts, setMaxAttempts] = useState(5);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        // Generate a unique session ID (simple implementation)
        const id = Date.now().toString();
        setSessionId(id);
        startGame(id)
            .then(response => {
                console.log(response.data.message);
            })
            .catch(error => {
                console.error('Error starting game:', error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!guess) return;

        makeGuess(sessionId, parseInt(guess))
            .then(response => {
                const data = response.data;
                setFeedback(data.feedback);
                setFeedbackType(data.feedback_type);
                if (data.attempts) setAttempts(data.attempts);
                if (data.max_attempts) setMaxAttempts(data.max_attempts);
                if (data.score) setScore(data.score);
                if (data.game_over) setGameOver(true);
                playSound(data.feedback_type);
            })
            .catch(error => {
                console.error('Error making guess:', error);
            });
    };

    const handlePlayAgain = () => {
        resetGame(sessionId)
            .then(response => {
                console.log(response.data.message);
                setFeedback('');
                setFeedbackType('');
                setAttempts(0);
                setGameOver(false);
                setGuess('');
            })
            .catch(error => {
                console.error('Error resetting game:', error);
            });
    };

    const playSound = (type) => {
        const sound = type === 'success' ? new Audio(successSound) : new Audio(errorSound);
        sound.play().catch(error => {
            console.error('Error playing sound:', error);
        });
    };

    return (
        <section className="py-5">
            <div className="container">
                <div className="game-wrapper p-4 bg-white rounded shadow">
                    <h2 className="mb-4">Start Guessing!</h2>
                    {!gameOver ? (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <input
                                    type="number"
                                    value={guess}
                                    onChange={(e) => setGuess(e.target.value)}
                                    className="form-control form-control-lg"
                                    placeholder="Enter your number (1-1000)"
                                    min="1"
                                    max="1000"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-success btn-lg w-100">Submit Guess</button>
                        </form>
                    ) : (
                        <div className="text-center">
                            <button className="btn btn-warning btn-lg w-100" onClick={handlePlayAgain}>Try Again</button>
                        </div>
                    )}

                    {feedback && (
                        <div className={`alert alert-${feedbackType === 'success' ? 'success' : 'danger'} mt-4`} role="alert">
                            {feedback}
                        </div>
                    )}

                    {!gameOver && (
                        <div className="mt-3">
                            <p>Attempt {attempts} of {maxAttempts}</p>
                        </div>
                    )}

                    {score > 0 && (
                        <div className="mt-2">
                            <p>Your Score: {score}</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Game;
