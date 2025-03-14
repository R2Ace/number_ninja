import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://number-ninja.onrender.com/api'
    : 'http://localhost:5000/api';

    export const startGame = (sessionId, difficultySettings = {}) => {
        // Log what's being sent
        console.log("API call - Starting game with:", {
            session_id: sessionId,
            ...difficultySettings
        });
        
        // Make sure values are the right types
        const payload = { 
            session_id: sessionId,
            difficulty: difficultySettings.difficulty || 'ninja',
            max_number: parseInt(difficultySettings.maxNumber) || 1000,
            max_attempts: parseInt(difficultySettings.maxAttempts) || 5
        };
        
        console.log("Sending payload:", payload);
        
        return axios.post(`${API_BASE_URL}/start`, payload, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000 // Add timeout to prevent hanging requests
        }).catch(error => {
            console.error("Error in startGame API call:", error);
            // Re-throw to allow component to handle
            throw error;
        });
    };

// Also update the makeGuess function with similar improvements
export const makeGuess = (sessionId, guess) => {
    console.log("API call - Making guess:", { session_id: sessionId, guess });
    
    return axios.post(`${API_BASE_URL}/guess`, { 
        session_id: sessionId, 
        guess: parseInt(guess) 
    }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
    }).catch(error => {
        console.error("Error in makeGuess API call:", error);
        throw error;
    });
}

export const resetGame = (sessionId) => {
    return axios.post(`${API_BASE_URL}/reset`, { session_id: sessionId }, {
        headers: { 'Content-Type': 'application/json' }
    });
};

export const getScore = (sessionId) => {
    return axios.get(`${API_BASE_URL}/score`, { 
        params: { session_id: sessionId },
        headers: { 'Content-Type': 'application/json' }
    });
};

export const login = (credentials) => {
    return axios.post(`${API_BASE_URL}/login`, credentials, {
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      // Store only non-sensitive data
      const userData = {
        user_id: response.data.user_id,
        username: response.data.username,
        // Do NOT include password or full tokens
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      return response;
    }).catch(error => {
      if (error.response) {
        // The server responded with an error status
        const errorMessage = error.response.data.error || 'Login failed';
        console.error('Login error:', errorMessage);
        throw new Error(errorMessage);
      } else if (error.request) {
        // No response received
        console.error('No response from server');
        throw new Error('No response from server. Please check your connection.');
      } else {
        // Request setup error
        console.error('Request error:', error.message);
        throw new Error('Error sending request. Please try again.');
      }
    });
  };

export const register = (userData) => {
    return axios.post(`${API_BASE_URL}/register`, userData, {
        headers: { 'Content-Type': 'application/json' }
    });
};

export const fetchLeaderboard = () => {
    return axios.get(`${API_BASE_URL}/leaderboard`, {
        headers: { 'Content-Type': 'application/json' }
    });
};

export const getUserHistory = (userId) => {
    return axios.get(`${API_BASE_URL}/user/history`, {
        params: { user_id: userId },
        headers: { 'Content-Type': 'application/json' }
    });
};

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.access_token) {
        return { Authorization: `Bearer ${user.access_token}` };
    }
    return {};
};

export const startDailyChallenge = (userId) => {
    return axios.post(`${API_BASE_URL}/daily-challenge/start`, { user_id: userId }, {
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
    });
};

export const saveDailyChallenge = (userId, sessionId) => {
    return axios.post(`${API_BASE_URL}/daily-challenge/save`, { 
        user_id: userId, 
        session_id: sessionId 
    }, {
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
    });
};

export const getDailyLeaderboard = () => {
    return axios.get(`${API_BASE_URL}/daily-challenge/leaderboard`, {
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
    });
};