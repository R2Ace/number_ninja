import React, { useState } from 'react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const FirebaseAuth = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Store user data
      const userData = {
        user_id: result.user.uid,
        username: result.user.displayName || result.user.email.split('@')[0],
        email: result.user.email,
        oauth_provider: 'firebase',
        profile_picture: result.user.photoURL
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      onSuccess?.();
      navigate('/game');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError(error.message || 'Error signing in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="bg-white text-gray-700 font-semibold py-2 px-4 rounded shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center mb-4"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="w-6 h-6 mr-2"
        />
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </button>
      
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default FirebaseAuth;
