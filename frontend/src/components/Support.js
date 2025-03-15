import React, { useState } from 'react';
import { Coffee, X } from 'lucide-react';

const Support = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSupportRequest = () => {
    // Handle support request logic here
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center p-3 rounded-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 shadow-lg transition-all transform hover:scale-105"
        aria-label="Support the developer"
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Coffee className="w-5 h-5" />
        )}
      </button>

      {/* Support panel that appears when clicked */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-72 bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 shadow-xl animate-fade-in">
          <div className="flex items-center space-x-3 mb-3">
            <Coffee className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-white">Support the Developer</h3>
          </div>
          
          <p className="text-gray-300 mb-4 text-sm">
            Enjoying Number Ninja? Your support helps create more cool games and features!
          </p>
          
          <a 
            href="https://buymeacoffee.com/r2ace" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-all w-full justify-center"
          >
            <Coffee className="w-4 h-4 mr-2" />
            Buy Me a Coffee
          </a>

          {/* Support or help button */}
          <button 
            onClick={handleSupportRequest}
            className="bg-yellow-500 text-white font-medium py-2 px-4 rounded-lg mt-4"
          >
            Get Help
          </button>
        </div>
      )}
    </>
  );
};

export default Support;