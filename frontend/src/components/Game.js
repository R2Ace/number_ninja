import React, { useState, useEffect } from 'react';
import { startGame, makeGuess, resetGame, fetchLeaderboard } from '../services/api';
import successSound from '../assets/success.mp3';
import errorSound from '../assets/error.mp3';
import { Target, RefreshCw, Send, Trophy, Calendar, Star, Settings } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import DifficultySelector, { difficultyLevels } from './DifficultySelector';
import Support from './Support';

const ShareGameResult = ({ score, attempts, difficulty }) => {
    const { currentTheme } = useTheme();
    
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
        <div id="share-content" className={`${currentTheme.cardBg} backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center`}>
            <h3 className="text-2xl font-bold text-white mb-4">Great Game!</h3>
            <div className={`bg-gradient-to-r from-gray-900 to-${currentTheme.primary}-900/30 p-6 rounded-lg mb-6`}>
                <p className={`text-${currentTheme.primary}-400 text-lg`}>Score: {score}</p>
                <p className="text-gray-400">Solved in {attempts} attempts</p>
                <p className="text-gray-400 mt-2">Difficulty: {difficultyLevels[difficulty].name}</p>
            </div>
            <button 
                onClick={handleShare}
                className={`inline-flex items-center px-6 py-3 bg-gradient-to-r from-${currentTheme.primary}-600 to-${currentTheme.secondary}-600 rounded-lg text-white font-medium hover:from-${currentTheme.primary}-700 hover:to-${currentTheme.secondary}-700 transition-all`}
            >
                Save Image to Share
            </button>
        </div>
    );
};


const Game = () => {
    const { currentTheme } = useTheme();
    const [currentUser, setCurrentUser] = useState(null);
    const [sessionId, setSessionId] = useState(() => {
        // Generate a unique session ID on component mount
        return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      });
    const [guess, setGuess] = useState('');
    const [feedback, setFeedback] = useState('');
    const [feedbackType, setFeedbackType] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [maxAttempts, setMaxAttempts] = useState(5);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [leaderboard, setLeaderboard] = useState([]);
    const [currentDate] = useState(new Date().toLocaleDateString());
    const [showDifficultySelector, setShowDifficultySelector] = useState(false);
    const [difficulty, setDifficulty] = useState('ninja'); // Default difficulty
    const [maxNumber, setMaxNumber] = useState(1000); // Default max number

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
        
        // Load saved difficulty preference
        const savedDifficulty = localStorage.getItem('numberNinjaDifficulty');
        if (savedDifficulty && difficultyLevels[savedDifficulty]) {
            setDifficulty(savedDifficulty);
            updateDifficultySettings(savedDifficulty);
        } else { 
            // Set default difficulty settings
            updateDifficultySettings('ninja');
        }
    }, []);
    
    // Start a new game when maxNumber and maxAttempts are set
    useEffect(() => {
        // Only start a new game if maxNumber and maxAttempts are set
        // and if we're not in the initial render
        if (maxNumber > 0 && maxAttempts > 0 && sessionId) {
          console.log("Settings changed, starting new game:", {
            difficulty, maxNumber, maxAttempts
          });
          startNewGame();
        }
      }, [maxNumber, maxAttempts]);

    const updateDifficultySettings = (difficultyId) => {
        console.log("Updating settings for difficulty:", difficultyId);
        const diffLevel = difficultyLevels[difficultyId];
        
        if (!diffLevel) {
            console.error("Invalid difficulty:", difficultyId);
            return;
        }
        
        // Set max attempts from difficulty level
        setMaxAttempts(diffLevel.attempts);
        
        // Extract max number from range (format "1-1000" or "1-10000")
        const range = diffLevel.range.split('-');
        if (range.length === 2) {
            const newMaxNumber = parseInt(range[1], 10);
            if (!isNaN(newMaxNumber) && newMaxNumber > 0) {
                setMaxNumber(newMaxNumber);
            } else {
                console.error("Invalid number range in difficulty:", diffLevel.range);
            }
        } else {
            console.error("Could not parse range from difficulty:", diffLevel.range);
        }
    };
    

    useEffect(() => {
        // When difficulty changes, update settings first
        updateDifficultySettings(difficulty);
        
        // Then fetch leaderboard
        fetchLeaderboard()
            .then(response => {
                setLeaderboard(response.data);
            })
            .catch(error => {
                console.error('Error fetching leaderboard:', error);
            });
    }, [difficulty]); // Run when difficulty changes

    // Add this separate effect to start a new game when maxNumber or maxAttempts change
    useEffect(() => {
    // Only start a new game if sessionId exists (not on initial render)
        if (sessionId) {
            console.log("Settings changed, starting new game:", {
                difficulty, maxNumber, maxAttempts
            });
            startNewGame();
        }
    }, [maxNumber, maxAttempts]); // Run when these change

    const startNewGame = () => {
        // Generate a new unique session ID
        const id = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.log("Starting new game with ID:", id);
        
        // Reset game state BEFORE making the API call
        setSessionId(id);
        setAttempts(0);  // Reset attempts counter
        setGameOver(false);
        setScore(0);
        setFeedback('');
        setFeedbackType('');
        
        // Get current difficulty settings
        const diffSettings = difficultyLevels[difficulty];
        
        // Pass difficulty info to backend
        startGame(id, { 
          difficulty, 
          maxNumber, 
          maxAttempts: diffSettings.attempts 
        })
        .then((response) => {
          // If the backend returns initial game state, use it
          if (response.data) {
            if (response.data.max_attempts) {
              setMaxAttempts(response.data.max_attempts);
            }
          }
          
          console.log("Game started successfully with ID:", id);
          // Track game start event
          if (window.gtag) {
            window.gtag('event', 'game_start', {
              'event_category': 'gameplay',
              'event_label': difficulty,
              'value': maxNumber
            });
          }
        })
        .catch(error => {
          console.error("Error starting game:", error);
          // Show user-friendly error
          setFeedback("There was an error starting the game. Please try again.");
          setFeedbackType("error");
        });
      };

    
    // This function handles the form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!guess) return;
        
        // Check for valid sessionId
        if (!sessionId) {
          console.error("Cannot submit guess: No valid session ID");
          setFeedback("Game session error. Please start a new game.");
          setFeedbackType("error");
          return;
        }
      
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
            console.log("Guess response:", data); // Add this to see the response
            
            setFeedback(data.feedback);
            setFeedbackType(data.feedback_type);
            
            // Always update attempts from the response
            if (data.attempts !== undefined) {
              setAttempts(data.attempts);
            } else {
              // Increment locally if server didn't return attempts
              setAttempts(prevAttempts => prevAttempts + 1);
            }
            
            if (data.score) {
              setScore(data.score);
            }
            
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
            console.error("Error submitting guess:", error);
            
            // Check if it's a max attempts error (400 status)
            if (error.response && error.response.status === 400) {
              // If we get specific error data, use it
              if (error.response.data && error.response.data.feedback) {
                setFeedback(error.response.data.feedback);
                setFeedbackType(error.response.data.feedback_type || 'error');
                
                // Check if game should be over
                if (error.response.data.game_over) {
                  setGameOver(true);
                }
                
                // Update attempts if provided
                if (error.response.data.attempts !== undefined) {
                  setAttempts(error.response.data.attempts);
                }
              } else {
                // Generic message if no specific data
                setFeedback('Maximum attempts reached. Game over!');
                setFeedbackType('error');
                setGameOver(true);
              }
            } else {
              // Generic error for other issues
              setFeedback('An error occurred. Please try again or start a new game.');
              setFeedbackType('error');
            }
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
            startNewGame();
        });
    };

    const handleDifficultyChange = (difficultyId) => {
        console.log("Changing difficulty to:", difficultyId);
        
        // Only change if it's a valid difficulty
        if (difficultyLevels[difficultyId]) {
          setDifficulty(difficultyId);
          localStorage.setItem('numberNinjaDifficulty', difficultyId);
          
          // Close the difficulty selector
          setShowDifficultySelector(false);
          
          // Track difficulty selection
          if (window.gtag) {
            window.gtag('event', 'select_difficulty', {
              'event_category': 'gameplay',
              'event_label': difficultyId
            });
          }
        } else {
          console.error("Invalid difficulty selected:", difficultyId);
        }
      };

        // Add a reset function to go back to difficulty selection
    const resetToSelectDifficulty = () => {
        setGameStarted(false);
        setGameOver(false);
        setAttempts(0);
        setScore(0);
        setFeedback('');
        setFeedbackType('');
        };

    const playSound = (type) => {
        const audio = new Audio(type === 'success' ? successSound : errorSound);
        audio.play().catch(() => {});
    };

    return (
        <div className={`min-h-screen flex flex-col bg-gradient-to-b ${currentTheme.background}`}>
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
                            <div className="flex space-x-2">
                                <button 
                                    onClick={() => setShowDifficultySelector(!showDifficultySelector)}
                                    className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                                    title="Change Difficulty"
                                >
                                    <Settings className="w-5 h-5" />
                                </button>
                                <button 
                                    onClick={handleReset}
                                    className="p-2 text-gray-400 hover:text-white transition-colors"
                                    title="New Game"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {showDifficultySelector ? (
                            <div className="mb-6">
                                <DifficultySelector 
                                    selectedDifficulty={difficulty} 
                                    onSelectDifficulty={handleDifficultyChange}
                                    onClose={() => setShowDifficultySelector(false)}
                                />
                            </div>
                        ) : (
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">
                                        Difficulty: <span className={`text-${difficultyLevels[difficulty].color}-500`}>{difficultyLevels[difficulty].name}</span>
                                    </span>
                                    <span className="text-gray-400">Range: {difficultyLevels[difficulty].range}</span>
                                </div>
                                
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">
                                        Attempts: {attempts > 0 || gameOver ? attempts: "-" }/{maxAttempts}
                                        </span>
                                    <span className="text-blue-400">Score: {score}</span>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <input
                                        type="number"
                                        value={guess}
                                        onChange={(e) => setGuess(e.target.value)}
                                        placeholder={`Enter your guess (1-${maxNumber})`}
                                        className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                        min="1"
                                        max={maxNumber}
                                        required
                                    />
                                    <button 
                                        type="submit"
                                        className={`w-full ${currentTheme.buttonBg} text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2`}
                                    >
                                        <Send className="w-5 h-5" />
                                        <span>Submit Guess</span>
                                    </button>
                                </form>

                                {feedback && (
                                    <div className={`p-4 rounded-lg ${
                                        feedbackType === 'success' ? `bg-${currentTheme.primary}-600/20 text-${currentTheme.primary}-400` :
                                        feedbackType === 'error' ? 'bg-red-600/20 text-red-400' :
                                        `bg-${currentTheme.accent}-600/20 text-${currentTheme.accent}-400`
                                    }`}>
                                        {feedback}
                                    </div>
                                )}

                                {/* Game Instructions */}
                                <div className="mt-8 pt-6 border-t border-gray-700">
                                    <h3 className="text-lg font-semibold text-white mb-2">How to Play:</h3>
                                    <ul className="text-gray-400 space-y-2">
                                        <li>• Enter a number between 1 and {maxNumber}</li>
                                        <li>• You have {maxAttempts} attempts to guess correctly</li>
                                        <li>• Watch for hints after each guess</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Leaderboard */}
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
                        
                        {/* Theme settings link */}
                        <div className="mt-6 text-center">
                            <Link 
                                to="/themes" 
                                className="text-blue-400 hover:text-blue-300 flex items-center justify-center"
                            >
                                <Settings className="w-4 h-4 mr-1" />
                                <span>Customize Theme</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
            {gameOver && (
                <div className="container mx-auto px-4 pb-8">
                    <ShareGameResult 
                        score={score} 
                        attempts={attempts}
                        difficulty={difficulty}
                    />
                </div>
            )}
            <Support />
        </div>
    );
};

export default Game;