// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Add alert to show what URL we're using
alert(`API URL being used: ${API_BASE_URL}`);

export const startGame = (sessionId) => {
    alert(`Starting new game with session: ${sessionId}`);
    return axios.post(`${API_BASE_URL}/start`, { session_id: sessionId }, {
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        alert(`Game started successfully: ${JSON.stringify(response.data)}`);
        return response;
    })
    .catch(error => {
        alert(`Error starting game: ${error.message}`);
        throw error;
    });
};

export const makeGuess = (sessionId, guess) => {
    alert(`Sending guess: ${guess}`);
    return axios.post(`${API_BASE_URL}/guess`, { session_id: sessionId, guess }, {
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        alert(`Server response: ${JSON.stringify(response.data)}`);
        return response;
    })
    .catch(error => {
        alert(`Error making guess: ${error.message}\nAPI URL: ${API_BASE_URL}`);
        throw error;
    });
};

export const resetGame = (sessionId) => {
    alert('Resetting game...');
    return axios.post(`${API_BASE_URL}/reset`, { session_id: sessionId }, {
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        alert(`Game reset: ${JSON.stringify(response.data)}`);
        return response;
    })
    .catch(error => {
        alert(`Error resetting game: ${error.message}`);
        throw error;
    });
};

export const getScore = (sessionId) => {
    return axios.get(`${API_BASE_URL}/score`, { 
        params: { session_id: sessionId },
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        alert(`Score retrieved: ${JSON.stringify(response.data)}`);
        return response;
    })
    .catch(error => {
        alert(`Error getting score: ${error.message}`);
        throw error;
    });
};

export const login = (credentials) => {
    alert('Attempting login...');
    return axios.post(`${API_BASE_URL}/login`, credentials, {
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        alert(`Login successful: ${JSON.stringify(response.data)}`);
        return response;
    })
    .catch(error => {
        alert(`Login error: ${error.message}`);
        throw error;
    });
};

export const register = (userData) => {
    alert('Attempting registration...');
    return axios.post(`${API_BASE_URL}/register`, userData, {
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        alert(`Registration successful: ${JSON.stringify(response.data)}`);
        return response;
    })
    .catch(error => {
        alert(`Registration error: ${error.message}`);
        throw error;
    });
};