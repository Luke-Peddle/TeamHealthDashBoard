import React from 'react'
import axios from 'axios';
import redis from '@/lib/redis'
import {useState} from 'react';
import { useRouter } from 'next/router';
import {User} from '@/types/user';
import { GetServerSideProps } from 'next/types';


interface UserProps {
  user: User 
}



export const getServerSideProps = async (context) => {
  try {
    const { id } = context.params;
    const response = await axios.get(`http://localhost:4000/api/users/${id}`);
    console.log(response.data);
    const user = response.data;
    return { props: { user } };
  
  } catch (error) {
    return { props: { users: null } };
  }
}

const Users: React.FC<UserProps> = ({user}) => {

  
  const router = useRouter();

  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updateUser = { ...user };
    console.log("User: " + JSON.stringify(user))

    if(userName !== '') {
      updateUser.username = userName
    }
    if(firstName !== '') {
      updateUser.first_name = firstName
    }
    if(lastName !== '') {
      updateUser.last_name = lastName
    }
    if(email !== '') {
      updateUser.email = email
    }
    if(role !== '') {
      updateUser.role = role
    }
    console.log(updateUser)

    setMessage({ text: 'Updating user...', type: 'info' });
    axios.patch("http://localhost:4000/api/users", updateUser) 
      .then(response => {
        setMessage({ text: 'user updated sucessfully', type: 'info' });
          console.log('user updated successfully:', response.data);
          setTimeout(() => {
            router.reload();
          }, 1000);
        })
      .catch(error => {
          console.error('There was an error updating the user!', error);
          setMessage({ text: 'Error updating user', type: 'error' });
      });
  }

  console.log(user)
  return (
    <div className="max-w-md mx-auto my-8 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 p-4 border-b">
        <p className="text-gray-600">{user.first_name} {user.last_name}</p>
        <span className="mt-1 inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded">
          {user.role}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Update {user.first_name} {user.last_name}</h3>
        {message.text && (
                <div className={`mb-4 p-2 rounded text-sm ${
                    message.type === 'success' ? 'bg-green-100 text-green-800' : 
                    message.type === 'error' ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'
                }`}>
                    {message.text}
                </div>
            )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder={user.username}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={user.first_name}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={user.last_name}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={user.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="Manager"
                  name="role"
                  value="manager"
                  onChange={(e) => setRole(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="Manager" className="ml-2 text-sm text-gray-700">Manager</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="Admin"
                  name="role"
                  value="admin"
                  onChange={(e) => setRole(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="Admin" className="ml-2 text-sm text-gray-700">Admin</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="contributor"
                  name="role"
                  value="contributor"
                  onChange={(e) => setRole(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="contributor" className="ml-2 text-sm text-gray-700">Contributor</label>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Users