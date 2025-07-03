import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../app/contexts/AuthContext';

const LogoutButton = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
     <button
      onClick={handleLogout}
      className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-black dark:text-white px-4 py-2 rounded-md transition-colors duration-150 border border-gray-300 dark:border-gray-600"
    >
      Logout
    </button>
  )
}

export default LogoutButton