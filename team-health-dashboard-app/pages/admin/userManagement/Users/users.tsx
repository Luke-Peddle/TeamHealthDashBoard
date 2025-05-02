
import React, {useEffect, useState} from 'react';
import {User} from '@/types/user';

interface UsersProps {
    users: User[] 
  }


const Users: React.FC<UsersProps> = ({ users} ) => {
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
                <div key={user.id} className="p-3 border rounded shadow-sm">
                    <h3 className="font-semibold">{ user.userName}</h3>
                    <p>{user.firstName}</p>
                    <p>{user.lastName}</p>
                    <p>{user.email}</p>
                    <p>Role: {user.role}</p>
                </div>
            ))}
        </div>
    )}
</div>
  )
}

export default Users