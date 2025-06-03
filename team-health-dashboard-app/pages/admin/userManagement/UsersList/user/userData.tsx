import React, { useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/router';
import { X, Loader2 } from 'lucide-react';
import {User} from '@/types/user';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { error } from 'console';


interface UsersProps {
  user: User 
}

const UserData:React.FC<UsersProps> = ({user}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const queryClient = useQueryClient();
  const id = user.user_id;

  const deleteUserMutation = useMutation({
    mutationFn: async () =>{
        const response = await axios.delete(`http://localhost:4000/api/users/id/${id}`);
        return response.data;
      },
      onSuccess: () =>{
        console.log("User Deleted");
        queryClient.invalidateQueries({ queryKey: ['users'] });
        setShowConfirm(false);

      },
      onError: (error) =>{
        console.error('error deleting user:', error)
        alert('Failed to delete user. Please try again.')
        setShowConfirm(false);

      }
    })
  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    deleteUserMutation.mutate();
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  const isDeleting = deleteUserMutation.isPending;

  
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
        onClick={handleDeleteClick}
        disabled={isDeleting}
        className="absolute -top-2 -right-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-transparent bg-red-500 text-white shadow-sm hover:bg-red-600"
        title="Delete User"
      >
        <X size={14} />
      </button>

      {showConfirm && (
        <div className="absolute inset-0 bg-white bg-opacity-95 rounded-lg flex items-center justify-center border-2 border-red-200 backdrop-blur-sm">
          <div className="text-center p-3">
            <p className="text-xs text-gray-700 mb-3">
              Delete "{user.username}"?
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
              >
                {isDeleting && <Loader2 size={10} className="animate-spin" />}
                Delete
              </button>
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserData