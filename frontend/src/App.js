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
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;

