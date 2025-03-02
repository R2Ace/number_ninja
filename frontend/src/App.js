import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
import LaunchPage from './components/LauchPage';

// Create a wrapper component to use the router hooks
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (!hasVisited && location.pathname !== '/launch') {
      localStorage.setItem('hasVisitedBefore', 'true');
      navigate('/launch');
    }
  }, [navigate, location]);

  return (
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
      </Routes>
      <Footer />
    </div>
  );
}

// Main App component with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;