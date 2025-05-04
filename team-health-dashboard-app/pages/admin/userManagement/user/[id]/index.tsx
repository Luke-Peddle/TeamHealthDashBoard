import React from 'react'
import axios from 'axios';
import redis from '@/lib/redis'

export async function getServerSideProps(context) {
  try{
  const { id } = context.params;

  const cacheKey = `user:${id}`;

  const cacheData = await redis.get(cacheKey);

  if(cacheData){
    const user = JSON.parse(cacheData)
    return { props: { user } };
  }
  
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
  console.log(user)
  return (
    <div className='border-2 border-solid'>
      <p>sdgesg</p>
    <h3 className="font-semibold">
        {user.first_name} {user.last_name}</h3>
    <p> {user.role}</p>
</div>
  )
}

export default users