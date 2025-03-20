import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, User, Lock, Mail, ArrowRight } from 'lucide-react';
import { login, register } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import GoogleAuth from './GoogleAuth';

const Login = () => {
    const { currentTheme } = useTheme();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        let isValid = true;
        let errors = {};
        
        // Username validation
        if (!formData.username || formData.username.length < 3) {
          errors.username = 'Username must be at least 3 characters';
          isValid = false;
        }
        
        // Email validation (only for registration)
        if (!isLogin) {
          const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!formData.email || !emailPattern.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
            isValid = false;
          }
        }
        
        // Password validation
        if (!formData.password || formData.password.length < 8) {
          errors.password = 'Password must be at least 8 characters';
          isValid = false;
        }
        
        setError(errors.username || errors.email || errors.password || '');
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }
        
        try {
            let response;
            if (isLogin) {
                response = await login({
                    username: formData.username,
                    password: formData.password
                });

                // Store user data in local storage and redirect to game page
                localStorage.setItem('user', JSON.stringify(response.data));
                navigate('/game');
            } else {
                response = await register({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                });

                // Store user data in local storage and redirect to game page
                localStorage.setItem('user', JSON.stringify(response.data));
                navigate('/game');
            }
        } catch (err) {
            console.error('Authentication error:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            setError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleGoogleSuccess = (userData) => {
        // Redirect to game page after successful Google authentication
        navigate('/game');
    };

    return (
        <div className={`min-h-screen bg-gradient-to-b ${currentTheme.background} py-16 px-4`}>
            <div className="max-w-md mx-auto">
                <div className={`${currentTheme.cardBg} backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8`}>
                    {/* Header */}
                    <div className="flex items-center justify-center space-x-3 mb-8">
                        <Target className={`w-8 h-8 text-${currentTheme.primary}-500`}/>
                        <h2 className="text-2xl font-bold text-white">
                            Number Ninja
                        </h2>
                    </div>

                    {/* Google Authentication */}
                    <div className="mb-6">
                        <GoogleAuth onSuccess={handleGoogleSuccess} />
                    </div>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-gray-700"></div>
                        <span className="px-3 text-gray-500 text-sm">OR</span>
                        <div className="flex-grow border-t border-gray-700"></div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username */}
                        <div>
                            <label className="block text-gray-300 mb-2">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Enter your username"
                                />
                            </div>
                        </div>

                        {/* Email (for registration) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-gray-300 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Password */}
                        <div>
                            <label className="block text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Enter your password"
                                />
                            </div>
                            
                            {!isLogin && (
                              <div className="mt-2 text-xs text-gray-400">
                                <p>Password must:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                  <li className={formData.password.length >= 8 ? "text-green-400" : ""}>
                                    Be at least 8 characters long
                                  </li>
                                  <li className={/[A-Z]/.test(formData.password) ? "text-green-400" : ""}>
                                    Include an uppercase letter
                                  </li>
                                  <li className={/[a-z]/.test(formData.password) ? "text-green-400" : ""}>
                                    Include a lowercase letter
                                  </li>
                                  <li className={/[0-9]/.test(formData.password) ? "text-green-400" : ""}>
                                    Include a number
                                  </li>
                                </ul>
                              </div>
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="text-red-500 text-sm bg-red-500/10 p-2 rounded">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full ${currentTheme.buttonBg} text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-105 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                    <span>{isLogin ? 'Logging in...' : 'Registering...'}</span>
                                </>
                            ) : (
                                <>
                                    <span>{isLogin ? 'Login' : 'Register'}</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        {/* Forgot Password Link */}
                        {isLogin && (
                            <div className="text-center">
                                <a href="/forgot-password" className="text-blue-400 hover:text-blue-300 text-sm">
                                    Forgot your password?
                                </a>
                            </div>
                        )}

                        {/* Toggle Login/Register */}
                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-blue-400 hover:text-blue-300"
                            >
                                {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;