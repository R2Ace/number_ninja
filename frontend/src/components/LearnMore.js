// frontend/src/components/LearnMore.js
import React from 'react';
import { Book, Target, Trophy } from 'lucide-react';

const Section = ({ title, content, icon: Icon }) => {
    return (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
                <Icon className="w-8 h-8 text-blue-500" />
                <h2 className="text-2xl font-semibold text-white">{title}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">{content}</p>
        </div>
    );
};

const LearnMore = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Target className="w-10 h-10 text-blue-500" />
                        <h1 className="text-4xl font-bold text-white">About Number Ninja</h1>
                    </div>
                    
                    <div className="grid gap-8">
                        <Section
                            icon={Book}
                            title="How to Play"
                            content="Number Ninja is a strategic guessing game where you try to guess a number between 1 and 1000. After each guess, you'll receive hints to help you find the target number. You have 5 attempts to prove your ninja skills!"
                        />
                        
                        <Section
                            icon={Trophy}
                            title="Scoring System"
                            content="Your score is calculated based on how quickly you find the number. Fewer attempts mean higher scores! Challenge yourself to improve with each game and climb the leaderboard."
                        />
                        
                        <Section
                            icon={Target}
                            title="About the Developer"
                            content="Number Ninja started as a simple Python game file but gained unexpected popularity during Thanksgiving. Seeing its potential, R2, developer at Luminary Labz, transformed it into the engaging web game you see today!"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearnMore;