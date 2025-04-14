import React from 'react';
import FirebaseAuth from './FirebaseAuth';
import { useNavigate } from 'react-router-dom';
import { Target } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
    const { currentTheme } = useTheme();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to Number Ninja
                    </h2>
                </div>
                <FirebaseAuth onSuccess={() => navigate('/game')} />
            </div>
        </div>
    );
};

export default Login;