import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Star, Trophy, SendHorizonal } from 'lucide-react';
import { startDailyChallenge, makeGuess, saveDailyChallenge, getDailyLeaderboard } from '../services/api';
import successSound from '../assets/success.mp3';
import errorSound from '../assets/error.mp3';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const DailyChallenge = () => {
    const navigate = useNavigate();
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
    const [error, setError] = useState('');
    const [completed, setCompleted] = useState(false);
    const { currentTheme } = useTheme();
    const currentDate = useState(new Date().toLocaleDateString());
    
    // Load user data
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
    }, []);
    
    // Start daily challenge
    useEffect(() => {
        if (currentUser) {
            startDailyChallenge(currentUser.user_id)
                .then(response => {
                    setSessionId(response.data.session_id);
                    
                    // Track daily challenge start in analytics
                    if (window.gtag) {
                        window.gtag('event', 'daily_challenge_start', {
                            'event_category': 'gameplay',
                            'event_label': new Date().toISOString().split('T')[0]
                        });
                    }
                })
                .catch(err => {
                    if (err.response?.data?.error?.includes('already completed')) {
                        setCompleted(true);
                        setScore(err.response.data.score);
                        setAttempts(err.response.data.attempts);
                    } else {
                        setError('Error starting daily challenge');
                    }
                });
                
            // Get leaderboard
            getDailyLeaderboard()
                .then(response => {
                    setLeaderboard(response.data);
                })
                .catch(error => {
                    console.error('Error fetching daily leaderboard:', error);
                });
        }
    }, [currentUser]);
    
    // Handle guess submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!guess || !sessionId) return;
        
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
                    
                    // Save daily challenge score
                    if (currentUser) {
                        saveDailyChallenge(currentUser.user_id, sessionId)
                            .then(() => {
                                // Refresh leaderboard
                                getDailyLeaderboard()
                                    .then(response => {
                                        setLeaderboard(response.data);
                                    });
                                    
                                // Track completion
                                if (window.gtag) {
                                    window.gtag('event', 'daily_challenge_complete', {
                                        'event_category': 'gameplay',
                                        'event_label': data.feedback_type === 'success' ? 'win' : 'lose',
                                        'value': data.score || 0
                                    });
                                }
                            })
                            .catch(error => {
                                console.error('Error saving challenge:', error);
                            });
                    }
                }
                
                // Play sound
                const audio = new Audio(data.feedback_type === 'success' ? successSound : errorSound);
                audio.play().catch(() => {});
            })
            .catch(error => {
                setFeedback('An error occurred. Please try again.');
                setFeedbackType('error');
            });
            
        setGuess('');
    };
    
    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-16 px-4">
                <div className="max-w-md mx-auto bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center">
                    <Calendar className="mx-auto h-16 w-16 text-blue-500 mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-4">Daily Challenge</h2>
                    <p className="text-gray-300 mb-6">Please log in to participate in the daily challenge.</p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium"
                    >
                        Login to Play
                    </button>
                </div>
            </div>
        );
    }
    
    if (completed) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-16 px-4">
                <div className="max-w-md mx-auto bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center">
                    <Star className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-4">Daily Challenge Completed</h2>
                    <p className="text-gray-300 mb-4">You've already completed today's challenge!</p>
                    <div className="bg-gray-900/50 p-6 rounded-lg mb-6">
                        <p className="text-blue-400 text-lg">Your Score: {score}</p>
                        <p className="text-gray-400">Solved in {attempts} attempts</p>
                    </div>
                    <p className="text-gray-400 mb-6">Come back tomorrow for a new challenge!</p>
                    <button 
                        onClick={() => navigate('/game')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium"
                    >
                        Play Regular Game
                    </button>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-16 px-4">
                <div className="max-w-md mx-auto bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
                    <p className="text-red-400 mb-6">{error}</p>
                    <button 
                        onClick={() => navigate('/game')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium"
                    >
                        Play Regular Game
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="container mx-auto px-4 py-8 flex-grow">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Daily Challenge</h1>
                    <p className="text-gray-300">Solve today's number puzzle for bonus points!</p>
                </div>

                {/* Add promotional block here */}
                <div className="max-w-4xl mx-auto mb-6">
                    <div className={`bg-gradient-to-r from-${currentTheme.secondary}-800 to-${currentTheme.primary}-800 rounded-xl p-4 shadow-lg relative overflow-hidden`}>
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
                                <Calendar className="w-6 h-6 text-blue-500" />
                                <h2 className="text-xl font-bold text-white">Daily Number</h2>
                            </div>
                            <div className="text-yellow-400 flex items-center">
                                <Star className="w-4 h-4 mr-1" />
                                <span>Bonus Points!</span>
                            </div>
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
                                    disabled={gameOver}
                                />
                                <button 
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                    disabled={gameOver}
                                >
                                    <SendHorizonal className="w-5 h-5" />
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

                            {gameOver && (
                                <div className="mt-6 text-center">
                                    <button 
                                        onClick={() => navigate('/game')}
                                        className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium"
                                    >
                                        Play Regular Game
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Leaderboard Section */}
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                        <div className="flex items-center space-x-2 mb-6">
                            <Trophy className="w-6 h-6 text-yellow-500" />
                            <h2 className="text-xl font-bold text-white">Today's Leaders</h2>
                        </div>

                        {leaderboard.length > 0 ? (
                            <div className="space-y-4">
                                {leaderboard.map((player, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <span className="text-2xl font-bold text-yellow-400">
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
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 py-8">
                                <p>No scores yet today. Be the first!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyChallenge;