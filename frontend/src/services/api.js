import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://number-ninja.onrender.com/api'
    : 'http://localhost:5000/api';

export const startGame = (sessionId) => {
    return axios.post(`${API_BASE_URL}/start`, { session_id: sessionId }, {
        headers: { 'Content-Type': 'application/json' }
    });
};

export const makeGuess = (sessionId, guess) => {
    return axios.post(`${API_BASE_URL}/guess`, { 
        session_id: sessionId, 
        guess: parseInt(guess) 
    }, {
        headers: { 'Content-Type': 'application/json' }
    });
};

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
    });
};

export const register = (userData) => {
    return axios.post(`${API_BASE_URL}/register`, userData, {
        headers: { 'Content-Type': 'application/json' }
    });
};