import React from 'react'
import axios from 'axios';
import { useRouter } from 'next/router';



const UserData = ({user}) => {
  const router = useRouter();

  console.log(user)
    const deleteUser = async ()=>{
        try {
            const response = await axios.delete(`http://localhost:4000/api/users/id/${user.user_id}`);
            router.reload();

            
          } catch (error) {
            console.error('Server-side delet error:', error);
          }
      }
  return (
    <div> <a href = {`/admin/userManagement/user/${user.user_id}`}>
    <div key={user.user_id} className='border-2 border-solid'>
        <h3 className="font-semibold">
            {user.username} </h3>
        <p> {user.role}</p>
        
    </div></a><button onClick={deleteUser}>delete User</button></div>
  )
}

export default UserData