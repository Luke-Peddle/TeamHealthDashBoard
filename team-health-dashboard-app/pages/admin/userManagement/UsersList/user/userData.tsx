import React from 'react'
import axios from 'axios';
import { useRouter } from 'next/router';
import { X } from 'lucide-react';
import {User} from '@/types/user';

interface UsersProps {
  user: User 
}

const UserData:React.FC<UsersProps> = ({user}) => {
  const router = useRouter();
  
  const deleteUser = async () => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/users/id/${user.user_id}`);
      router.reload();
    } catch (error) {
      console.error('Server-side delete error:', error);
    }
  }  
  return (
    <div className="group relative">
      <a href={`/admin/userManagement/user/${user.user_id}`} className="block">
        <div className="bg-white rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-md p-4 group-hover:border-blue-300">
          <div className="flex items-center space-x-3">
           
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 truncate">
                {user.username}
              </h3>
              
              <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mt-1 `}>
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </a>
      
      <button 
        onClick={deleteUser}
        className="absolute -top-2 -right-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-transparent bg-red-500 text-white shadow-sm hover:bg-red-600"
        title="Delete User"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export default UserData