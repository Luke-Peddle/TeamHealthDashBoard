import React, {useEffect, useState} from 'react';
import {User} from '@/types/user';
import UserData from './user/userData'

interface UsersProps {
  users: User[] 
}

const UsersList: React.FC<UsersProps> = ({ users }) => {
  console.log(users);
  
  const userList = Array.isArray(users) ? users : [];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">User Management</h2>
      
      {userList.length === 0 ? (
        <div className="bg-gray-50 p-8 text-center rounded-md">
          <p className="text-gray-500 text-lg">No users found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userList.map(user => (
            <UserData key={user.user_id} user={user} />
          ))}
        </div>
      )}
    </div>
  )
}

export default UsersList