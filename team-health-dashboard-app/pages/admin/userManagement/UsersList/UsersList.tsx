
import React, {useEffect, useState} from 'react';
import {User} from '@/types/user';
import UserData from './user/userData'

interface UsersProps {
    users: User[] 
  }


const UsersList: React.FC<UsersProps> = ({ users} ) => {
    console.log(users);
    
    const userList = Array.isArray(users) ? users : [];

    
  return (
    <div className="p-4">
    <h2 className="text-2xl font-bold mb-4">User List</h2>
    {userList.length === 0 ? (
        <p>No users found</p>
    ) : (
        <div className="grid gap-4">
            {userList.map(user => (
                <UserData user={user} />
            ))}
        </div>
    )}
</div>
  )
}

export default UsersList