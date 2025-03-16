// frontend/src/App.js with fixed launch page redirect
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Banner from './components/Banner';
import PrizeAnnouncements from './components/PrizeAnnouncements'; // Add this import
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

// Check if user should be redirected to launch page
const shouldRedirectToLaunch = () => {
  // Set launch end time - 24 hours from now
  const launchEndTime = new Date();
  launchEndTime.setDate(launchEndTime.getDate() + 1); // 24 hours from now
  
  // Set this to March 17, 2025 to have it active for 24 hours from now
  const launchEndTimestamp = launchEndTime.getTime();
  
  // Check if user has explicitly clicked through from launch page
  const hasCompletedLaunch = localStorage.getItem('hasCompletedLaunch') === 'true';
  
  // If they haven't completed the launch flow and it's within the launch period, redirect
  return !hasCompletedLaunch && Date.now() < launchEndTimestamp;
};

// Route guard component
const RouteGuard = ({ children }) => {
  const location = useLocation();
  
  // Don't redirect if already on launch page or resetting password
  if (location.pathname === '/launch' || 
      location.pathname === '/reset-password' || 
      location.pathname.includes('/forgot-password')) {
    return children;
  }
  
  // Redirect to launch page if conditions are met
  if (shouldRedirectToLaunch()) {
    return <Navigate to="/launch" replace />;
  }
  
  return children;
};

// Modified LaunchPage component to fix the redirect issue
const EnhancedLaunchPage = () => {
  // When rendering the LaunchPage, mark that we've seen it
  useEffect(() => {
    localStorage.setItem('hasSeenLaunch', 'true');
  }, []);
  
  return <LaunchPage onEnterDojo={() => {
    // When Enter Dojo is clicked, mark that we've completed the launch flow
    localStorage.setItem('hasCompletedLaunch', 'true');
  }} />;
};

function App() {
    return (
        <ThemeProvider>
        {/* ThemeProvider wraps the entire application to provide theme context */}
        <Router>
            <div className="App">
                <Banner />
                <PrizeAnnouncements />
                <Routes>
                    <Route path="/" element={
                        <RouteGuard>
                            <LandingPage />
                        </RouteGuard>
                    } />
                    <Route path="/game" element={
                        <RouteGuard>
                            <Game />
                        </RouteGuard>
                    } />
                    <Route path="/login" element={
                        <RouteGuard>
                            <Login />
                        </RouteGuard>
                    } />
                    <Route path="/learn" element={
                        <RouteGuard>
                            <LearnMore />
                        </RouteGuard>
                    } />
                    <Route path="/history" element={
                        <RouteGuard>
                            <GameHistory />
                        </RouteGuard>
                    } />
                    <Route path="/forgot-password" element={<PasswordResetRequest />} />
                    <Route path="/reset-password" element={<PasswordReset />} />
                    <Route path="/launch" element={<EnhancedLaunchPage />} />
                    <Route path="/daily" element={
                        <RouteGuard>
                            <DailyChallenge />
                        </RouteGuard>
                    } />
                    <Route path="/themes" element={
                        <RouteGuard>
                            <ThemeSettings />
                        </RouteGuard>
                    } />
                    <Route path="/support" element={
                        <RouteGuard>
                            <Support />
                        </RouteGuard>
                    } />
                </Routes>
                <Footer />
            </div>
        </Router>
        </ThemeProvider>
    );
}

export default App;