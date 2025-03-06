import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LaunchPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // After animations, redirect to home page
    const timer = setTimeout(() => {
      navigate('/');
    }, 8000); // Increased time to allow for more animations
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
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
        className="relative mb-12 w-full max-w-2xl" // Increased max width
      >
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-30"></div>
        <motion.h1 
          className="text-6xl md:text-8xl font-bold text-white relative z-10 text-center" // Larger text
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
        className="text-2xl text-blue-300 mb-16 max-w-2xl text-center" // Larger text and spacing
      >
        Welcome to the official launch! Test your guessing skills and become the ultimate Ninja.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="relative mb-12" // Added bottom margin
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur-lg opacity-70"></div>
        <motion.button
          className="px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-lg relative z-10" // Larger button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
        >
          Enter the Dojo
        </motion.button>
      </motion.div>
      
      {/* Haitian Tribute with animated vertical lines */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="text-center mt-8 flex items-center justify-center space-x-4 relative" // More spacing
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