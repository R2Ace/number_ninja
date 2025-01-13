// frontend/src/services/api.js
import React, {useEffect} from 'react';
import axios from 'axios';

// Use environment variable for API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const startGame = (sessionId) => {
    return axios.post(`${API_BASE_URL}/start`, { session_id: sessionId }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true 
    });
};

export const makeGuess = (sessionId, guess) => {
    return axios.post(`${API_BASE_URL}/guess`, { session_id: sessionId, guess }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
    });
};

export const resetGame = (sessionId) => {
    return axios.post(`${API_BASE_URL}/reset`, { session_id: sessionId }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
    });
};

export const getScore = (sessionId) => {
    return axios.get(`${API_BASE_URL}/score`, { 
        params: { session_id: sessionId },
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
    });
};

// Removed TestComponent and fetchData as they're not needed

export const login = (credentials) => {
    return axios.post(`${API_BASE_URL}/login`, credentials, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
    });
};

export const register = (userData) => {
    return axios.post(`${API_BASE_URL}/register`, userData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
    });
};