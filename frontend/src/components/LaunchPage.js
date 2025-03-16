import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const LaunchPage = ({ onEnterDojo }) => {
  const navigate = useNavigate();
  const [showPrize, setShowPrize] = useState(false);
  
  useEffect(() => {
    // Show prize announcement after Haitian tribute animation completes
    const prizeTimer = setTimeout(() => {
      setShowPrize(true);
    }, 4500); // 3s delay + 0.8s animation + 0.7s buffer
    
    // After all animations, redirect to home page
    const redirectTimer = setTimeout(() => {
      handleEnterDojo();
    }, 10000); // Increased time to allow for prize announcement viewing
    
    return () => {
      clearTimeout(prizeTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);
  
  const handleEnterDojo = () => {
    // Call the provided callback to update localStorage
    if (onEnterDojo) {
      onEnterDojo();
    }
    
    // Navigate to home page
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center overflow-hidden relative px-4">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-16 bg-blue-500/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: '100%',
            }}
            animate={{
              top: '-10%',
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative mb-12 w-full max-w-2xl"
      >
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-30"></div>
        <motion.h1 
          className="text-6xl md:text-8xl font-bold text-white relative z-10 text-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Number Ninja
        </motion.h1>
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-2xl text-blue-300 mb-16 max-w-2xl text-center"
      >
        Welcome to the official launch! Test your guessing skills and become the ultimate Ninja.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="relative mb-12"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur-lg opacity-70"></div>
        <motion.button
          className="px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-lg relative z-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEnterDojo}
        >
          Enter the Dojo
        </motion.button>
      </motion.div>
      
      {/* Haitian Tribute with animated vertical lines */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="text-center mt-8 flex items-center justify-center space-x-4 relative"
      >
        {/* Left vertical popout */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 50 }}
          transition={{ delay: 3, duration: 0.8 }}
          className="w-1 bg-red-500 absolute -left-8"
        />
        
        <span className="text-red-500 text-2xl">❤️</span>
        <p className="italic text-gray-300 text-lg">"Let every Z shine" ~ Tribute to Haiti</p>
        <span className="text-blue-500 text-2xl">❤️</span>
        
        {/* Right vertical popout */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 50 }}
          transition={{ delay: 3, duration: 0.8 }}
          className="w-1 bg-blue-500 absolute -right-8"
        />
      </motion.div>
      
      {/* Prize Announcement - appears after tribute animation */}
      {showPrize && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mt-12 max-w-lg w-full"
        >
          <div className="bg-gradient-to-r from-yellow-800 to-amber-700 rounded-xl p-4 shadow-lg relative overflow-hidden border-2 border-yellow-500/30">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/20 rounded-full -mr-8 -mt-8 blur-2xl"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-500/20 p-3 rounded-lg">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">$100 PRIZE!</h3>
                  <p className="text-yellow-200 text-sm">First winner on Ninja mode claims $100</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ delay: 3, duration: 3, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 z-0"
      />
    </div>
  );
};

export default LaunchPage;