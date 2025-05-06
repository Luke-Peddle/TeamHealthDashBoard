import React from 'react'
import axios from 'axios';
import redis from '@/lib/redis'
import {useState} from 'react';
import { useRouter } from 'next/router';



export async function getServerSideProps(context) {
  try{
  const { id } = context.params;

  const cacheKey = `user:${id}`;

  const cacheData = await redis.get(cacheKey);

  if(cacheData){
    console.log("Cache Passed")
    const user = JSON.parse(cacheData)
    return { props: { user } };
  }

  console.log("Chache failed")
  
    const response = await axios.get(`http://localhost:4000/api/users/id/${id}`);
    console.log(response.data);
    const user = response.data;
    await redis.set(cacheKey, JSON.stringify(user), 'EX', 3600);
    
    return { props: { user } };
  
  } catch (error) {
    return { props: { users: null } };
  }
}
const users = ({user}) => {
  const router = useRouter();

  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  
  const handleSubmit =(e)=>{
    e.preventDefault();
    const updateUser = { ...user };
    console.log("User: " + JSON.stringify(user))

    if(userName !== ''){
      updateUser.username = userName
    }
    if(firstName !== ''){
      updateUser.first_name = firstName
    }

    if(lastName !== ''){
      updateUser.last_name = lastName
    }
    if(email !== ''){
      updateUser.email = email
    }
    if(role !== ''){
      updateUser.role = role
    }
    console.log(updateUser)

    axios.patch("http://localhost:4000/api/users", updateUser) 
    .then(response => {
        console.log('user updated successfully:', response.data);

        setTimeout(() => {
          router.reload();
        }, 1000);
      })
    .catch(error => {
        console.error('There was an error updating the user!', error);
    });
}

  console.log(user)
  return (
    <div className='border-2 border-solid'>
    <h3 className="font-semibold">
      {user.username}
        </h3>
        <p>{user.first_name} {user.last_name}</p>
    <p> {user.role}</p>

    <div >
      <h3>Update {user.first_name} {user.last_name}</h3>
        <form onSubmit={handleSubmit}>
            <div>
                
                <label>Username</label>
                <br/>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    
                    className= "border "
                />
            </div>
            <br/>

            <div>
                <label>First Name</label>
                <br/>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    
                    className= "border "
                />

            </div>
            <br/>

            <div>
                <label>Last Name</label>
                <br/>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    
                    className= "border "
                />
            </div>
            <br/>

            <div>
                <label>Email</label>
                <br/>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    
                    className= "border "
                />
            </div>
            <br/>

            <div>
                <label>Role</label>
                <br/>
                <input
                    type="radio"
                    id = "Manager"
                    name = 'role'
                    value={'manager'}
                    onChange={(e) => setRole(e.target.value)}
                    
                />
                <label htmlFor  = "Manager">manager</label><br></br>

                <input
                    type="radio"
                    id = "Admin"
                    name = 'role'
                    value={'admin'}
                    onChange={(e) => setRole(e.target.value)}
                    
                />
                <label htmlFor  = "Admin">admin</label><br></br>
           

            <input
                    type="radio"
                    id = "contributor"
                    name = 'role'
                    value={"contributor"}
                    onChange={(e) => setRole(e.target.value)}
                    
                />
                <label htmlFor  = "contributor">contributor</label><br></br>
                <br/>
                
            </div>

            <button type="submit" className='border'>Update User</button>
        </form>
        </div>
</div>
  )
}

export default users