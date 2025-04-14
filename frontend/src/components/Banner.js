import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Target, LogOut, User, Settings, History } from 'lucide-react';
import logo from '../assets/Luminary_Labz.svg';
import { useTheme } from '../context/ThemeContext';

const Banner = () => {
    const { currentTheme } = useTheme();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    
    useEffect(() => {
        // Load user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            setCurrentUser(JSON.parse(userData));
        }
    }, []);
    
    const handleLogout = () => {
        // Clear user data from localStorage
        localStorage.removeItem('user');
        setCurrentUser(null);
        setShowDropdown(false);
        navigate('/');
    };
    
    return (
        <div className={`bg-gradient-to-b ${currentTheme.background} border-b border-gray-800`}>
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <Target className={`w-6 h-6 text-${currentTheme.primary}-500`} />
                        <span className="text-xl font-bold text-white">Number Ninja</span>
                    </Link>
                    
                    {/* Navigation */}
                    <div className="flex items-center space-x-6">
                        <Link 
                            to="/game" 
                            className={`text-gray-300 hover:text-${currentTheme.primary}-400 transition-colors`}
                        >
                            Play
                        </Link>
                        <Link 
                            to="/history" 
                            className={`text-gray-300 hover:text-${currentTheme.primary}-400 transition-colors`}
                        >
                            History
                        </Link>
                        <Link 
                            to="/themes" 
                            className={`text-gray-300 hover:text-${currentTheme.primary}-400 transition-colors`}
                        >
                            Themes
                        </Link>
                        
                        {/* User Profile */}
                        {currentUser ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className={`flex items-center space-x-2 ${currentTheme.buttonBg} px-3 py-2 rounded-lg text-white`}
                                >
                                    {currentUser.profile_picture ? (
                                        <img 
                                            src={currentUser.profile_picture} 
                                            alt={currentUser.username}
                                            className="w-6 h-6 rounded-full"
                                        />
                                    ) : (
                                        <User className="h-5 w-5" />
                                    )}
                                    <span>{currentUser.username}</span>
                                </button>
                                
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-700">
                                        <Link 
                                            to="/game" 
                                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            Play Game
                                        </Link>
                                        <Link 
                                            to="/history" 
                                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <History className="h-4 w-4 mr-2" />
                                            Game History
                                        </Link>
                                        <Link 
                                            to="/themes" 
                                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <Settings className="h-4 w-4 mr-2" />
                                            Themes
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link 
                                to="/login" 
                                className={`${currentTheme.buttonBg} px-4 py-2 rounded-lg text-white`}
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;