// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Banner from './components/Banner';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import Game from './components/Game';
import Login from './components/Login';
import LearnMore from './components/LearnMore';
import './App.css'; // Import global styles
import GameHistory from './components/GameHistory';
import PasswordReset from './components/PasswordReset';
import PasswordResetRequest from './components/PasswordResetRequest';
import LaunchPage from './components/LaunchPage';
import DailyChallenge from './components/DailyChallenge';
import ThemeSettings from './components/ThemeSettings';
import { ThemeProvider } from './context/ThemeContext';
import Support from './components/Support';

function App() {
    return (
        <Router>
            <div className="App">
                <Banner />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/game" element={<Game />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/learn" element={<LearnMore />} />
                    <Route path="/history" element={<GameHistory />} />
                    <Route path="/forgot-password" element={<PasswordResetRequest />} />
                    <Route path="/reset-password" element={<PasswordReset />} />
                    <Route path="/launch" element={<LaunchPage />} />
                    <Route path="/daily" element={<DailyChallenge />} />
                    <Route path="/themes" element={<ThemeSettings />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;