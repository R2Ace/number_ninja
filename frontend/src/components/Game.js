import React, { useState, useEffect } from 'react';
import { startGame, makeGuess, resetGame, fetchLeaderboard } from '../services/api';
import successSound from '../assets/success.mp3';
import errorSound from '../assets/error.mp3';
import { Target, RefreshCw, Send, Trophy, Calendar, Star } from 'lucide-react';
import { toPng } from 'html-to-image';
import Support from './Support';
import { Link } from 'react-router-dom';

const ShareGameResult = ({ score, attempts }) => {
    const handleShare = () => {
        const node = document.getElementById('share-content');
        toPng(node)
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'number-ninja-result.png';
                link.click();
                
                // Track sharing event
                if (window.gtag) {
                    window.gtag('event', 'share_result', {
                        'event_category': 'engagement',
                        'event_label': 'image_download',
                        'value': score
                    });
                }
            })
            .catch((err) => {
                console.error('Error generating image:', err);
            });
    };

    return (
        <div id="share-content" className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Great Game!</h3>
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-lg mb-6">
                <p className="text-blue-400 text-lg">Score: {score}</p>
                <p className="text-gray-400">Solved in {attempts} attempts</p>
            </div>
            <button 
                onClick={handleShare}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
            >
                Save Image to Share
            </button>
        </div>
    );
};

const Game = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [guess, setGuess] = useState('');
    const [feedback, setFeedback] = useState('');
    const [feedbackType, setFeedbackType] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [maxAttempts, setMaxAttempts] = useState(5);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);
    const [currentDate] = useState(new Date().toLocaleDateString());

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
    }, []);

    useEffect(() => {
        const id = Date.now().toString();
        setSessionId(id);
        startGame(id).then(() => {
            // Track game start event
            if (window.gtag) {
                window.gtag('event', 'game_start', {
                    'event_category': 'gameplay',
                    'event_label': currentUser ? 'logged_in' : 'guest'
                });
            }
        });

        fetchLeaderboard()
            .then(response => {
                setLeaderboard(response.data);
            })
            .catch(error => {
                console.error('Error fetching leaderboard:', error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!guess) return;

        // Track guess submission
        if (window.gtag) {
            window.gtag('event', 'submit_guess', {
                'event_category': 'gameplay',
                'event_label': `attempt_${attempts + 1}`,
                'value': parseInt(guess)
            });
        }

        makeGuess(sessionId, parseInt(guess))
            .then(response => {
                const data = response.data;
                setFeedback(data.feedback);
                setFeedbackType(data.feedback_type);
                if (data.attempts) setAttempts(data.attempts);
                if (data.max_attempts) setMaxAttempts(data.max_attempts);
                if (data.score) setScore(data.score);
                
                if (data.game_over) {
                    setGameOver(true);
                    
                    // Track game completion
                    if (window.gtag) {
                        window.gtag('event', 'game_complete', {
                            'event_category': 'gameplay',
                            'event_label': data.feedback_type === 'success' ? 'win' : 'lose',
                            'value': data.score || 0
                        });
                    }
                }
                
                playSound(data.feedback_type);
            })
            .catch(error => {
                setFeedback('An error occurred. Please try again.');
                setFeedbackType('error');
            });

        setGuess('');
    };

    const handleReset = () => {
        // Track game reset
        if (window.gtag) {
            window.gtag('event', 'game_reset', {
                'event_category': 'gameplay',
                'event_label': gameOver ? 'after_completion' : 'during_game',
                'value': attempts
            });
        }
        
        resetGame(sessionId).then(() => {
            setGuess('');
            setFeedback('');
            setFeedbackType('');
            setAttempts(0);
            setGameOver(false);
            setScore(0);
            const newId = Date.now().toString();
            setSessionId(newId);
            startGame(newId);
        });
    };

    const playSound = (type) => {
        const audio = new Audio(type === 'success' ? successSound : errorSound);
        audio.play().catch(() => {});
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="container mx-auto px-4 py-8 flex-grow">
                <div className="mb-6 text-center">
                    {currentUser ? (
                        <p className="text-lg text-blue-400">Welcome back, {currentUser.username}!</p>
                    ) : (
                        <p className="text-gray-400">Please log in to save your score</p>
                    )}
                </div>

                {/* Daily Challenge Banner */}
                <div className="max-w-4xl mx-auto mb-6">
                    <div className="bg-gradient-to-r from-indigo-800 to-purple-800 rounded-xl p-4 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/20 rounded-full -mr-8 -mt-8 blur-2xl"></div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="bg-yellow-500/20 p-3 rounded-lg">
                                    <Calendar className="w-8 h-8 text-yellow-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">Daily Challenge</h3>
                                    <p className="text-gray-300 text-sm">{currentDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                                <Link 
                                    to="/daily" 
                                    className="bg-white text-indigo-900 hover:bg-yellow-100 font-bold py-2 px-4 rounded-lg shadow transition-colors"
                                >
                                    Play Today's Challenge
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                    {/* Game Section */}
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center space-x-2">
                                <Target className="w-6 h-6 text-blue-500" />
                                <h2 className="text-xl font-bold text-white">Number Ninja</h2>
                            </div>
                            <button 
                                onClick={handleReset}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <RefreshCw className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Attempts: {attempts}/{maxAttempts}</span>
                                <span className="text-blue-400">Score: {score}</span>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="number"
                                    value={guess}
                                    onChange={(e) => setGuess(e.target.value)}
                                    placeholder="Enter your guess (1-1000)"
                                    className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                    min="1"
                                    max="1000"
                                    required
                                />
                                <button 
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                >
                                    <Send className="w-5 h-5" />
                                    <span>Submit Guess</span>
                                </button>
                            </form>

                            {feedback && (
                                <div className={`p-4 rounded-lg ${
                                    feedbackType === 'success' ? 'bg-green-600/20 text-green-400' :
                                    feedbackType === 'error' ? 'bg-red-600/20 text-red-400' :
                                    'bg-yellow-600/20 text-yellow-400'
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

                    {/* Right Column - Support and Leaderboard */}
                    <div className="space-y-6">
                        {/* Support Component */}
                        <Support />
                        
                        {/* Leaderboard Section */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                            <div className="flex items-center space-x-2 mb-6">
                                <Trophy className="w-6 h-6 text-blue-500" />
                                <h2 className="text-xl font-bold text-white">Leaderboard</h2>
                            </div>

                            <div className="space-y-4">
                                {leaderboard.map((player, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <span className="text-2xl font-bold text-blue-400">
                                                #{index + 1}
                                            </span>
                                            <div>
                                                <div className="font-medium text-white">
                                                    {player.username}
                                                </div>
                                                <div className="text-sm text-gray-400">
                                                    Score: {player.score} • Attempts: {player.attempts}
                                                </div>
                                            </div>
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
            </div>
            {gameOver && (
                <div className="container mx-auto px-4 pb-8">
                    <ShareGameResult 
                        score={score} 
                        attempts={attempts}
                    />
                </div>
            )}
        </div>
    );
};

export default Game;