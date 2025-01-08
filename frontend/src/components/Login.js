import React, { useState } from 'react';
import { Target, User, Lock, Mail } from 'lucide-react';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/api/login' : '/api/register';
        
        try {
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            
            if (response.ok) {
                // Handle successful login/register
                console.log('Success:', data);
                // You might want to redirect to game or store user info
            } else {
                setError(data.error || 'An error occurred');
            }
        } catch (err) {
            setError('Failed to connect to server');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-16 px-4">
            <div className="max-w-md mx-auto">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                    {/* Header */}
                    <div className="flex items-center justify-center space-x-3 mb-8">
                        <Target className="w-8 h-8 text-blue-500" />
                        <h2 className="text-2xl font-bold text-white">
                            Number Ninja
                        </h2>
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
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
                        >
                            {isLogin ? 'Login' : 'Register'}
                        </button>

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