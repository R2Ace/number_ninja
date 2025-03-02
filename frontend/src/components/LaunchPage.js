import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LaunchPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // After animations, redirect to home page
    const timer = setTimeout(() => {
      navigate('/');
    }, 6000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-30"></div>
        <motion.h1 
          className="text-5xl md:text-7xl font-bold text-white relative z-10"
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
        className="text-xl text-blue-300 mb-12 max-w-md text-center"
      >
        Welcome to the official launch! Test your guessing skills and become the ultimate Ninja.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur-lg opacity-70"></div>
        <motion.button
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg relative z-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
        >
          Enter the Dojo
        </motion.button>
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