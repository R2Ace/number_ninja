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
        <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                        <img src={logo} alt="Luminary Labz" className="h-8 w-auto" />
                        <div className="flex items-center space-x-2">
                            <Target className={`h-5 w-5 text-${currentTheme.primary}-500`}/>
                            <span className="text-lg font-semibold text-white">Number Ninja</span>
                        </div>
                    </Link>
                    
                    <div className="flex items-center space-x-4">
                        {currentUser ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className={`flex items-center space-x-2 ${currentTheme.buttonBg} px-3 py-2 rounded-lg text-white`}
                                >
                                    <User className="h-5 w-5" />
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
                                            Theme Settings
                                        </Link>
                                        <button 
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link 
                                to="/login" 
                                className={`${currentTheme.buttonBg} text-white px-4 py-2 rounded-lg transform hover:scale-105 transition-all`}
                            >
                                <div className="flex items-center space-x-2">
                                    <Target className={`h-5 w-5 text-white`}/>
                                    <span>Login</span>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Banner;