// frontend/src/components/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // Create and style as needed

const LandingPage = () => {
    return (
        <header className="hero-section text-center">
            <div className="container">
                <h1 className="display-4">Welcome to Number Ninja!</h1>
                <p className="lead">Can you guess the correct number between 1 and 1000 in just 5 tries?</p>
                <Link to="/game" className="btn btn-primary btn-lg mt-3">Play Now</Link>
            </div>
        </header>
    );
};

export default LandingPage;
