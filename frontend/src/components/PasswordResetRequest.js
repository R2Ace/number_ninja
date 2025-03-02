import React, { useState } from 'react';
import { Mail } from 'lucide-react';

const PasswordResetRequest = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // Will implement API call later
            setStatus('success');
        } catch (error) {
            setStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-16 px-4">
            <div className="max-w-md mx-auto">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
                    <div className="flex items-center justify-center space-x-3 mb-8">
                        <Mail className="w-8 h-8 text-blue-500" />
                        <h2 className="text-2xl font-bold text-white">Reset Password</h2>
                    </div>
                    
                    {status === 'success' ? (
                        <div className="text-center text-green-400 p-4 bg-green-400/10 rounded-lg">
                            If your email is registered, you will receive a password reset link shortly.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-300 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-4 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            
                            {status === 'error' && (
                                <div className="text-red-400 text-sm">
                                    Unable to process your request. Please try again.
                                </div>
                            )}
                            
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-all"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PasswordResetRequest;