import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const GoogleAuth = ({ onSuccess }) => {
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const googleButtonRef = useRef(null);

  useEffect(() => {
    // Load the Google API script
    const loadGoogleScript = () => {
      // Check if script is already loaded
      if (document.querySelector('script#google-auth')) {
        setTimeout(initializeGoogleAuth, 100); // Add slight delay to ensure DOM is ready
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.id = 'google-auth';
      script.async = true;
      script.defer = true;
      script.onload = () => setTimeout(initializeGoogleAuth, 100); // Add delay here too
      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  const initializeGoogleAuth = () => {
    if (!window.google) {
      console.log("Google API not loaded");
      return;
    }

    // Correct Google Client ID 
    const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    console.log("Using Client ID:", CLIENT_ID);

    // Check if button container ref is available
    if (!googleButtonRef.current) {
      console.error("Google sign-in button container ref not available");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleGoogleResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Render the button using the ref
    window.google.accounts.id.renderButton(
      googleButtonRef.current,
      { 
        theme: 'outline', 
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: 250
      }
    );
  };

  const handleGoogleResponse = async (response) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Send the ID token to your backend for verification
      const backendResponse = await fetch('https://number-ninja.onrender.com/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: response.credential
        }),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        throw new Error(errorData.error || 'Failed to authenticate with Google');
      }

      const userData = await backendResponse.json();
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify({
        user_id: userData.user_id,
        username: userData.username,
        email: userData.email,
        oauth_provider: 'google'
      }));

      // Callback for parent component
      if (onSuccess) {
        onSuccess(userData);
      } else {
        navigate('/game');
      }
      
    } catch (err) {
      console.error('Google authentication error:', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="text-red-500 text-sm mb-4 bg-red-500/10 p-2 rounded">
          {error}
        </div>
      )}
      
      <div className="flex flex-col space-y-4">
        <div 
          ref={googleButtonRef}
          className="flex justify-center"
        ></div>
        
        {isLoading && (
          <div className="text-center text-gray-400">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2">Authenticating...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleAuth;