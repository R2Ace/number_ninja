// frontend/src/components/Banner.js
import React from 'react';
import logo from '../assets/logo.png'; // Add your logo image to src/assets/

const Banner = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <a className="navbar-brand" href="/">
                    <img src={logo} alt="Number Ninja" width="30" height="30" className="d-inline-block align-top" />
                    Number Ninja
                </a>
                <div className="ml-auto">
                    <button className="btn btn-outline-light">Login</button>
                </div>
            </div>
        </nav>
    );
};

export default Banner;
