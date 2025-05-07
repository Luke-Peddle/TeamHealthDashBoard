
import React, {useEffect, useState} from 'react';
import {User} from '@/types/user';

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
                <a href = {`/admin/userManagement/id/${user.user_id}`}>
                <div key={user.user_id} className='border-2 border-solid'>
                    <h3 className="font-semibold">
                        {user.first_name} {user.last_name}</h3>
                    <p> {user.role}</p>
                </div></a>
            ))}
        </div>
    )}
</div>
  )
}

export default UsersList