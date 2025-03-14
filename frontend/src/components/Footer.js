import React from 'react';
import { Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
    const { currentTheme } = useTheme();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <span className="text-gray-400">© {currentYear} Number Ninja. All rights reserved.</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-400">
                        <span>Made with</span>
                        <Heart className={`h-4 w-4 text-${currentTheme.secondary}-500 animate-pulse`} />
                        <span>by Luminary Labz</span>
                    </div>
                </div>

                <div className="mt-4 flex justify-center space-x-6">
                    <button className="text-gray-400 hover:text-white transition-colors">Privacy Policy</button>
                    <button className="text-gray-400 hover:text-white transition-colors">Terms of Service</button>
                    <button className="text-gray-400 hover:text-white transition-colors">Contact</button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;