// frontend/src/services/api.js
import React, {useEffect} from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const startGame = (sessionId) => {
    return axios.post(`${API_BASE_URL}/start`, { session_id: sessionId },
        { headers: { 'Content-Type': 'application/json' },
    withCredentials: true });
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

const TestComponent = () => {
    useEffect(() => {
        axios.get('http://localhost:5000/api/hello')
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    return <div>Check the console for response!</div>;
};

export default TestComponent;