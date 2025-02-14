import React, { useState, useEffect } from 'react';
import { startGame, makeGuess, resetGame, fetchLeaderboard, saveScore} from '../services/api';
import successSound from '../assets/success.mp3';
import errorSound from '../assets/error.mp3';
import { Target, RefreshCw, Send, Trophy } from 'lucide-react';
import { toPng } from 'html-to-image';
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
    const [sessionId, setSessionId] = useState(null);
    const [guess, setGuess] = useState('');
    const [feedback, setFeedback] = useState('');
    const [feedbackType, setFeedbackType] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [maxAttempts, setMaxAttempts] = useState(5);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')));

    const playSound = (feedbackType) => {
        const audio = new Audio(feedbackType === 'success' ? successSound : errorSound);
        audio.play();
    };

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
                
                if (data.game_over) {
                    handleGameOver(data.score || score, data.attempts || attempts);
                }
                
                playSound(data.feedback_type);
            })
            .catch(error => {
                setFeedback('An error occurred. Please try again.');
                setFeedbackType('error');
            });

        setGuess('');
    };

    const handleGameOver = async (finalScore, attemptsUsed) => {
        try {
            if (currentUser?.user_id) {
                await saveScore({
                    score: finalScore,
                    attempts: attemptsUsed,
                    user_id: currentUser.user_id
                });
                
                const leaderboardResponse = await fetchLeaderboard();
                setLeaderboard(leaderboardResponse.data);
            }
            
            setGameOver(true);
            
        } catch (err) {
            console.error('Error saving score:', err);
            setFeedback('Error saving your score. Please try again.');
            setFeedbackType('error');
        }
    };

    useEffect(() => {
        const id = Date.now().toString();
        setSessionId(id);
        startGame(id);

        fetchLeaderboard()
            .then(response => {
                setLeaderboard(response.data);
            })
            .catch(error => {
                console.error('Error fetching leaderboard:', error);
            });
    }, []);

    const handleReset = () => {
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

                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                    {/* Game Section */}
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center space-x-2">
                                <Target className="w-6 h-6 text-blue-500" />
                                <h2 className="text-xl font-bold text-white">Number Ninja</h2>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link 
                                    to="/history" 
                                    className="text-blue-400 hover:text-blue-300"
                                >
                                    View Game History
                                </Link>
                                <button 
                                    onClick={handleReset}
                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </button>
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