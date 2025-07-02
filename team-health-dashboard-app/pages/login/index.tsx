import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../app/contexts/AuthContext';
import { useRouter } from 'next/router';

const index = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    
    const { login } = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: async (credentials) => {
            return await login(credentials.username, credentials.password);
        },
        onMutate: () => {
            setMessage({ text: 'Logging in...', type: 'info' });
        },
        onSuccess: (result) => {
            if (result.success) {
                console.log('User logged in successfully:', result.data);
                setMessage({ text: 'Login successful!', type: 'success' });
                
                setUserName('');
                setPassword('');
                
                queryClient.invalidateQueries({ queryKey: ['users'] });
                
                router.push('/dashbaord');
                
                setTimeout(() => {
                    setMessage({ text: '', type: '' });
                }, 3000);
            } else {
                setMessage({ text: result.error, type: 'error' });
                setTimeout(() => {
                    setMessage({ text: '', type: '' });
                }, 5000);
            }
        },
        onError: (error) => {
            console.error('Login failed:', error);
            setMessage({ text: 'An unexpected error occurred', type: 'error' });
            
            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 5000);
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!userName.trim() || !password.trim()) {
            setMessage({ text: 'Please fill in all fields', type: 'error' });
            return;
        }
        
        const loginData = {
            username: userName.trim(),
            password: password,
        };
        
        loginMutation.mutate(loginData);
    };

    const isSubmitting = loginMutation.isPending;

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Login
            </h2>
            
            {message.text && (
                <div className={`mb-4 p-3 rounded-md ${
                    message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' :
                    message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-300' :
                    'bg-blue-100 text-blue-700 border border-blue-300'
                }`}>
                    {message.text}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                    </label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter your username"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Enter your password"
                    />
                </div>

                <div className="pt-2">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </span>
                        ) : (
                            'Login'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default index;