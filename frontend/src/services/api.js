import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://number-ninja.onrender.com/api'
    : 'http://localhost:5000/api';

    export const startGame = (sessionId, difficultySettings = {}) => {
        return axios.post(`${API_BASE_URL}/start`, { 
            session_id: sessionId,
            difficulty: difficultySettings.difficulty || 'ninja',
            max_number: difficultySettings.maxNumber || 1000,
            max_attempts: difficultySettings.maxAttempts || 5
        }, {
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