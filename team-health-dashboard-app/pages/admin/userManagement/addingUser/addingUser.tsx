"use client"
import React, {useState} from 'react';
import axios from "axios";
import { useRouter } from 'next/router';


const AddingUser = () => {
      const router = useRouter();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
   
    console.log(userName);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const newUser = {
            username: userName,
            password: password,
            firstName: firstName,
            lastName: lastName,
            email: email,
            role: role
        }
        console.log(newUser);

        setMessage({ text: 'Creating user...', type: 'info' });

        axios.post("http://localhost:4000/api/users", newUser) 
        .then(response => {
            console.log('user created successfully:', response.data);
            setMessage({ text: 'User created successfully!', type: 'success' });
            
            setUserName('');
            setPassword('');
            setFirstName('');
            setLastName('');
            setEmail('');
            setRole('');

            setTimeout(() => {
                router.reload();
              }, 1000);
        })
        .catch(error => {
            console.error('There was an error creating the user!', error);
            setMessage({ text: 'Error creating user', type: 'error' });
        });
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
            <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Create a New User</h3>
            
            {message.text && (
                <div className={`mb-4 p-2 rounded text-sm ${
                    message.type === 'success' ? 'bg-green-100 text-green-800' : 
                    message.type === 'error' ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                    </label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                    </label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                    </label>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="Manager"
                                name="role"
                                value="manager"
                                onChange={(e) => setRole(e.target.value)}
                                required
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label htmlFor="Manager" className="ml-2 text-sm text-gray-700">
                                Manager
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="Admin"
                                name="role"
                                value="admin"
                                onChange={(e) => setRole(e.target.value)}
                                required
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label htmlFor="Admin" className="ml-2 text-sm text-gray-700">
                                Admin
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="contributor"
                                name="role"
                                value="contributor"
                                onChange={(e) => setRole(e.target.value)}
                                required
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label htmlFor="contributor" className="ml-2 text-sm text-gray-700">
                                Contributor
                            </label>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Add User
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddingUser