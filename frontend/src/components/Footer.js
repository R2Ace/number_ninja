// frontend/src/components/Footer.js
import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-primary text-white text-center py-3">
            <div className="container">
                <p>&copy; {currentYear} Number Ninja. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
