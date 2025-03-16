import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Updated with your actual Stripe publishable key
const stripePromise = loadStripe('pk_live_51R3AvQA8Xjc7tVUmcB8mnHKzB4da5dpBWdHz0FruInXipeUhEcFi7KrypPM8UoGKPDfbNuVDPjphK2kbik5Ay685004802Bs1y');

// Store your price ID in a constant to avoid hardcoding it in multiple places
const PREMIUM_THEMES_PRICE_ID = 'price_1R3BXzA8Xjc7tVUm2FRtURiV';

const StripeCheckout = ({ onSuccess, onClose }) => {
  const { currentTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    
    try {
      const stripe = await stripePromise;
      
      // Get current user from localStorage if available
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Call your backend to create a checkout session
      const response = await fetch('https://number-ninja.onrender.com/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: PREMIUM_THEMES_PRICE_ID, // Your Stripe Price ID
          userId: currentUser?.user_id || 'guest',
          username: currentUser?.username || 'Guest User',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const session = await response.json();
      
      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      // If checkout is successful, this code may not run because of the redirect
      setSuccess(true);
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'An error occurred during checkout');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`${currentTheme.cardBg} backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 max-w-md mx-auto text-center`}>
        <CheckCircle className={`w-16 h-16 text-${currentTheme.primary}-500 mx-auto mb-4`} />
        <h2 className="text-2xl font-bold text-white mb-4">Purchase Successful!</h2>
        <p className="text-gray-300 mb-6">You now have access to all premium themes!</p>
        <button 
          onClick={onClose}
          className={`${currentTheme.buttonBg} text-white px-6 py-3 rounded-lg font-medium`}
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className={`${currentTheme.cardBg} backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 max-w-md mx-auto`}>
      <div className="flex items-center space-x-3 mb-6">
        <Lock className={`w-6 h-6 text-${currentTheme.primary}-500`} />
        <h2 className="text-2xl font-bold text-white">Unlock All Themes</h2>
      </div>
      
      <div className="bg-gray-900/50 p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-white font-medium">All Premium Themes</span>
          <span className="text-2xl font-bold text-white">$0.99</span>
        </div>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            <span>Amethyst Theme</span>
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            <span>Sunset Warrior Theme</span>
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            <span>Midnight Gold Theme</span>
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            <span>Future new themes included</span>
          </li>
        </ul>
      </div>
      
      {error && (
        <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full ${currentTheme.buttonBg} text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 relative ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
      >
        <Lock className="w-5 h-5" />
        <span>{loading ? 'Processing...' : 'Pay $0.99'}</span>
      </button>
      
      <div className="mt-4 text-center">
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          Maybe Later
        </button>
      </div>
      
      <div className="mt-6 text-xs text-gray-500 text-center">
        <p>Secure payment processed by Stripe</p>
        <p>You'll be redirected to Stripe's secure checkout page</p>
      </div>
    </div>
  );
};

export default StripeCheckout;