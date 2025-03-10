import React from 'react';
import { Link } from 'react-router-dom';
import { Target } from 'lucide-react';
import logo from '../assets/Luminary_Labz.svg';

const Banner = () => {
    return (
        <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                        <img src={logo} alt="Luminary Labz" className="h-8 w-auto" />
                        <div className="flex items-center space-x-2">
                            <Target className="h-5 w-5 text-blue-500" />
                            <span className="text-lg font-semibold text-white">Number Ninja</span>
                        </div>
                    </Link>
                    
                    <div className="flex items-center space-x-4">
                        {/*<button className="text-gray-300 hover:text-white transition-colors">
                            How to Play
                        </button> */}
                        <Link 
                            to="/login" 
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Banner;