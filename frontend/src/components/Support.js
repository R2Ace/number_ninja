import React from 'react';
import { Coffee } from 'lucide-react';

const Support = () => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-8">
      <div className="flex items-center space-x-3 mb-4">
        <Coffee className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-white">Support the Developer</h3>
      </div>
      
      <p className="text-gray-300 mb-4">
        Enjoying Number Ninja? Consider supporting the development of more cool games and features!
      </p>
      
      <a 
        href="https://buymeacoffee.com/r2ace" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition-all"
      >
        <Coffee className="w-4 h-4 mr-2" />
        Buy Me a Coffee
      </a>
    </div>
  );
};

export default Support;