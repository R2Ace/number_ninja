// Updated API.js with improved error handling and retries
import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://number-ninja.onrender.com/api'
    : 'http://localhost:5000/api';

// Create axios instance with default settings
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000 // Increased timeout to 15 seconds
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
    config => {
        console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, config.data || config.params);
        return config;
    },
    error => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for logging
apiClient.interceptors.response.use(
    response => {
        console.log('API Response:', response.status, response.data);
        return response;
    },
    error => {
        console.error('API Response Error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        return Promise.reject(error);
    }
);

// Helper function to add retry functionality
const withRetry = async (apiCall, retries = 2, delay = 1000) => {
    try {
        return await apiCall();
    } catch (error) {
        if (retries === 0) {
            throw error;
        }
        
        console.log(`Retrying API call (${retries} attempts left)...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return withRetry(apiCall, retries - 1, delay * 1.5);
    }
};

// Updated API functions with retry functionality
export const startGame = (sessionId, difficultySettings = {}) => {
    // Make sure values are the right types
    const payload = { 
        session_id: sessionId,
        difficulty: difficultySettings.difficulty || 'ninja',
        max_number: parseInt(difficultySettings.maxNumber) || 1000,
        max_attempts: parseInt(difficultySettings.maxAttempts) || 5
    };
    
    return withRetry(() => apiClient.post('/start', payload));
};

export const makeGuess = (sessionId, guess) => {
    return withRetry(() => 
        apiClient.post('/guess', { 
            session_id: sessionId, 
            guess: parseInt(guess) 
        })
    );
};

export const resetGame = (sessionId) => {
    return withRetry(() => 
        apiClient.post('/reset', { session_id: sessionId })
    );
};

export const getScore = (sessionId) => {
    return withRetry(() => 
        apiClient.get('/score', { params: { session_id: sessionId } })
    );
};

export const login = (credentials) => {
    return withRetry(() => 
        apiClient.post('/login', credentials)
    ).then(response => {
        // Store only non-sensitive data
        const userData = {
            user_id: response.data.user_id,
            username: response.data.username,
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
    return withRetry(() => 
        apiClient.post('/register', userData)
    );
};

export const fetchLeaderboard = () => {
    return withRetry(() => 
        apiClient.get('/leaderboard')
    );
};

export const getUserHistory = (userId) => {
    return withRetry(() => 
        apiClient.get('/user/history', {
            params: { user_id: userId }
        })
    );
};

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.access_token) {
        return { Authorization: `Bearer ${user.access_token}` };
    }
    return {};
};

export const startDailyChallenge = (userId) => {
    return withRetry(() => 
        apiClient.post('/daily-challenge/start', 
            { user_id: userId }, 
            { headers: getAuthHeader() }
        )
    );
};

export const saveDailyChallenge = (userId, sessionId) => {
    return withRetry(() => 
        apiClient.post('/daily-challenge/save', 
            { user_id: userId, session_id: sessionId },
            { headers: getAuthHeader() }
        )
    );
};

export const getDailyLeaderboard = () => {
    return withRetry(() => 
        apiClient.get('/daily-challenge/leaderboard', 
            { headers: getAuthHeader() }
        )
    );
};