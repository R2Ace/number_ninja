// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api`;
console.log('API Base URL:', API_BASE_URL);  // Debug log

// Test connection function
export const testConnection = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/test`);
        alert(`Test response: ${JSON.stringify(response.data)}`);
        return response;
    } catch (error) {
        alert(`Test failed: ${error.message}\nAPI URL: ${API_BASE_URL}`);
        throw error;
    }
};

export const startGame = (sessionId) => {
    console.log('Starting game with session:', sessionId);
    return axios.post(`${API_BASE_URL}/start`, { session_id: sessionId }, {
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        console.log('Start game response:', response.data);
        return response;
    })
    .catch(error => {
        console.error('Start game error:', error.response?.data || error.message);
        alert(`Start game error: ${error.message}\nAPI URL: ${API_BASE_URL}`);
        throw error;
    });
};

export const makeGuess = (sessionId, guess) => {
    console.log('Making guess:', { sessionId, guess });
    return axios.post(`${API_BASE_URL}/guess`, { 
        session_id: sessionId, 
        guess: parseInt(guess) 
    }, {
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        console.log('Guess response:', response.data);
        return response;
    })
    .catch(error => {
        console.error('Guess error:', error.response?.data || error.message);
        alert(`Guess error: ${error.message}\nAPI URL: ${API_BASE_URL}`);
        throw error;
    });
};

export const resetGame = (sessionId) => {
    console.log('Resetting game:', sessionId);
    return axios.post(`${API_BASE_URL}/reset`, { session_id: sessionId }, {
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        console.log('Reset game response:', response.data);
        return response;
    })
    .catch(error => {
        console.error('Reset game error:', error.response?.data || error.message);
        alert(`Reset error: ${error.message}\nAPI URL: ${API_BASE_URL}`);
        throw error;
    });
};

export const getScore = (sessionId) => {
    console.log('Getting score:', sessionId);
    return axios.get(`${API_BASE_URL}/score`, { 
        params: { session_id: sessionId },
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        console.log('Get score response:', response.data);
        return response;
    })
    .catch(error => {
        console.error('Get score error:', error.response?.data || error.message);
        alert(`Score error: ${error.message}\nAPI URL: ${API_BASE_URL}`);
        throw error;
    });
};

export const login = (credentials) => {
    console.log('Attempting login...');
    return axios.post(`${API_BASE_URL}/login`, credentials, {
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        console.log('Login response:', response.data);
        return response;
    })
    .catch(error => {
        console.error('Login error:', error.response?.data || error.message);
        alert(`Login error: ${error.message}\nAPI URL: ${API_BASE_URL}`);
        throw error;
    });
};

export const register = (userData) => {
    console.log('Attempting registration...');
    return axios.post(`${API_BASE_URL}/register`, userData, {
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        console.log('Registration response:', response.data);
        return response;
    })
    .catch(error => {
        console.error('Registration error:', error.response?.data || error.message);
        alert(`Registration error: ${error.message}\nAPI URL: ${API_BASE_URL}`);
        throw error;
    });
};