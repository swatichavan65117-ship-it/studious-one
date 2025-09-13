import React, { useState } from 'react';
import { User, UserRole } from '../types';

// Inlined SVG icon for simplicity
const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

interface LoginScreenProps {
    onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState<UserRole>('student');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            onLogin({ name: username, role });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gray-800 rounded-full">
                        <span className="text-4xl font-bold text-white">S</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Studious One</h2>
                    <p className="mt-2 text-sm text-gray-600">Your School's Event Hub</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <UserIcon className="w-5 h-5 text-gray-400" />
                        </span>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            autoComplete="username"
                            required
                            className="w-full py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter your name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">I am a:</label>
                        <div className="flex space-x-4">
                            <button type="button" onClick={() => setRole('student')} className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${role === 'student' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                Student
                            </button>
                            <button type="button" onClick={() => setRole('teacher')} className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${role === 'teacher' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                Teacher
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <button type="submit" className="relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Sign in
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-xs text-center text-gray-500">
                    &copy; 2024 Studious One. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;
