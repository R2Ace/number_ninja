import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://number-ninja.onrender.com/api'
    : 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.access_token) {
        return { Authorization: `Bearer ${user.access_token}` };
    }
    return {};
};

// Create axios instance with interceptor for token refresh
const api = axios.create({
    baseURL: API_BASE_URL
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                if (user.refresh_token) {
                    const response = await refreshToken();
                    const { access_token } = response.data;
                    
                    // Update stored user data with new token
                    user.access_token = access_token;
                    localStorage.setItem('user', JSON.stringify(user));
                    
                    // Update auth header and retry
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return axios(originalRequest);
                }
            } catch (error) {
                // Handle refresh token failure (logout user)
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const startGame = (sessionId) => {
    return api.post('/start', { session_id: sessionId }, {
        headers: { 
            ...getAuthHeader(),
            'Content-Type': 'application/json' 
        }
    });
};

export const makeGuess = (sessionId, guess) => {
    return api.post('/guess', { 
        session_id: sessionId, 
        guess: parseInt(guess) 
    }, {
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json' 
        }
    });
};

export const resetGame = (sessionId) => {
    return api.post('/reset', { session_id: sessionId }, {
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json' 
        }
    });
};

export const getScore = (sessionId) => {
    return api.get('/score', { 
        params: { session_id: sessionId },
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json' 
        }
    });
};

export const login = (credentials) => {
    return api.post('/login', credentials, {
        headers: { 'Content-Type': 'application/json' }
    });
};

export const refreshToken = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return api.post('/refresh', {}, {
        headers: { 
            Authorization: `Bearer ${user.refresh_token}`,
            'Content-Type': 'application/json' 
        }
    });
};

export const register = (userData) => {
    return api.post('/register', userData, {
        headers: { 'Content-Type': 'application/json' }
    });
};

export const fetchLeaderboard = () => {
    return api.get('/leaderboard', {
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json' 
        }
    });
};

export const getUserHistory = (userId) => {
    return api.get('/user/history', {
        params: { user_id: userId },
        headers: {
            ...getAuthHeader(),
            'Content-Type': 'application/json' 
        }
    });
};

// Password reset functions
export const requestPasswordReset = (data) => {
    return axios.post(`${API_BASE_URL}/password-reset/request`, data, {
        headers: { 'Content-Type': 'application/json' }
    });
};

export const resetPassword = (data) => {
    return axios.post(`${API_BASE_URL}/password-reset/reset`, data, {
        headers: { 'Content-Type': 'application/json' }
    });
};

// Logout function to clear local storage
export const logout = () => {
    localStorage.removeItem('user');
    // You could also hit a backend logout endpoint here
    // to invalidate the token on the server
};