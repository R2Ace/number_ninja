// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const startGame = (sessionId) => {
    return axios.post(`${API_BASE_URL}/start`, { session_id: sessionId });
};

export const makeGuess = (sessionId, guess) => {
    return axios.post(`${API_BASE_URL}/guess`, { session_id: sessionId, guess });
};

export const resetGame = (sessionId) => {
    return axios.post(`${API_BASE_URL}/reset`, { session_id: sessionId });
};

export const getScore = (sessionId) => {
    return axios.get(`${API_BASE_URL}/score`, { params: { session_id: sessionId } });
};
