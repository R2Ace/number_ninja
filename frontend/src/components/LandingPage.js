import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Play, Sparkles, Brain, Trophy } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const LandingPage = () => {
  const { currentTheme } = useTheme();
  
  return (
    <div className={`min-h-screen ${currentTheme.background}`}>
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <Target className={`w-8 h-8 text-${currentTheme.primary}-500`} />
              <span className={`text-xl text-${currentTheme.primary}-500 font-semibold`}>Number Ninja</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Think You Can Beat
              <span className={`text-transparent bg-clip-text bg-gradient-to-r from-${currentTheme.primary}-400 to-${currentTheme.secondary}-500`}> the Unbeatable?</span>            </h1>
            
            <p className="text-xl text-gray-300">
              The ultimate number guessing game that challenges even the sharpest minds. 
              Are you ready to prove yourself?
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/game" 
                className={`inline-flex items-center px-6 py-3 rounded-lg ${currentTheme.buttonBg} text-white font-semibold hover:scale-105 transition-all transform`}
              >
                <Play className="w-5 h-5 mr-2" />
                Play Now
              </Link>
              <Link 
                to="/learn" 
                className={`px-6 py-3 rounded-lg border border-gray-600 text-gray-300 font-semibold hover:bg-gray-800/30 hover:border-${currentTheme.primary}-500/50 transition-all`}
              >
                Learn More
              </Link>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center">
                <Sparkles className={`w-4 h-4 mr-2 text-${currentTheme.primary}-500`}/>
                No Sign-up Required
              </div>
              <div className="flex items-center">
                <Target className={`w-4 h-4 mr-2 text-${currentTheme.primary}-500`}/>
                5 Attempts Per Game
              </div>
            </div>
          </div>

          {/* Right Column - Visual Element */}
          <div className="relative hidden md:block">
            <div className={`absolute inset-0 bg-${currentTheme.primary}-500/10 rounded-2xl blur-3xl`}></div>
            <div className="relative bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700">
              <div className="grid grid-cols-3 gap-4">
                {[...Array(9)].map((_, index) => (
                  <div 
                    key={index}
                    className="aspect-square rounded-lg bg-gray-700/50 flex items-center justify-center text-2xl font-bold text-blue-400"
                  >
                    {Math.floor(Math.random() * 900 + 100)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={`${currentTheme.cardBg} py-20`}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Mind-Bending Challenge",
                description: "Test your deductive reasoning and analytical skills"
              },
              {
                icon: Sparkles,
                title: "Adaptive Difficulty",
                description: "Each game provides a unique strategic challenge"
              },
              {
                icon: Trophy,
                title: "Compete & Win",
                description: "Track your progress and aim for the high score"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`p-6 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-${currentTheme.primary}-500/50 transition-all duration-300`}
              >
                <feature.icon className={`w-10 h-10 text-${currentTheme.primary}-500 mb-4`} />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;