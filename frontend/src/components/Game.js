import React, { useState, useEffect } from 'react';
import { startGame, makeGuess, resetGame } from '../services/api';
import successSound from '../assets/success.mp3';
import errorSound from '../assets/error.mp3';
import { Target, RefreshCw, Send, Trophy } from 'lucide-react';

const Game = () => {
    const [sessionId, setSessionId] = useState(null);
    const [guess, setGuess] = useState('');
    const [feedback, setFeedback] = useState('');
    const [feedbackType, setFeedbackType] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [maxAttempts, setMaxAttempts] = useState(5);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    // Leaderboard data
    const leaderboard = [
        { name: "Jalina", score: 500, date: "2024-03-20" },
        { name: "Naika", score: 500, date: "2024-03-19" }
    ];

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
        setGuess('');
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
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-16 px-4">
            <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
                {/* Game Section - Takes up 2 columns */}
                <div className="md:col-span-2">
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                        {/* Game Header */}
                        <div className="flex items-center space-x-3 mb-8">
                            <Target className="w-8 h-8 text-blue-500" />
                            <h2 className="text-2xl font-bold text-white">Number Ninja</h2>
                        </div>

                        {/* Game Status */}
                        {!gameOver && (
                            <div className="flex justify-between items-center mb-6">
                                <div className="text-gray-400">
                                    Attempt {attempts} of {maxAttempts}
                                </div>
                                {score > 0 && (
                                    <div className="text-blue-400 font-semibold">
                                        Score: {score}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Game Input */}
                        {!gameOver ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={guess}
                                        onChange={(e) => setGuess(e.target.value)}
                                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="Enter your guess (1-1000)"
                                        min="1"
                                        max="1000"
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
                                >
                                    <Send className="w-5 h-5" />
                                    <span>Submit Guess</span>
                                </button>
                            </form>
                        ) : (
                            <button 
                                onClick={handlePlayAgain}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
                            >
                                <RefreshCw className="w-5 h-5" />
                                <span>Play Again</span>
                            </button>
                        )}

                        {/* Feedback Message */}
                        {feedback && (
                            <div className={`mt-6 p-4 rounded-lg ${
                                feedbackType === 'success' 
                                    ? 'bg-green-500/20 border border-green-500/50 text-green-400' 
                                    : 'bg-red-500/20 border border-red-500/50 text-red-400'
                            }`}>
                                {feedback}
                            </div>
                        )}

                        {/* Game Instructions */}
                        <div className="mt-8 pt-6 border-t border-gray-700">
                            <h3 className="text-lg font-semibold text-white mb-2">How to Play:</h3>
                            <ul className="text-gray-400 space-y-2">
                                <li>• Enter a number between 1 and 1000</li>
                                <li>• You have {maxAttempts} attempts to guess correctly</li>
                                <li>• Watch for hints after each guess</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Leaderboard Section - Takes up 1 column */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 h-fit">
                    <div className="flex items-center space-x-3 mb-6">
                        <Trophy className="w-6 h-6 text-yellow-500" />
                        <h3 className="text-xl font-bold text-white">Top Players</h3>
                    </div>
                    <div className="space-y-4">
                        {leaderboard.map((player, index) => (
                            <div 
                                key={index}
                                className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 transition-all hover:border-blue-500/50"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-lg font-semibold text-white">
                                        {player.name}
                                    </span>
                                    <span className="text-blue-400 font-bold">
                                        {player.score}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-400">
                                    {new Date(player.date).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Game;