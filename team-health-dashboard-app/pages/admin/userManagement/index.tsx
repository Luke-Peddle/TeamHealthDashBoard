
import React from 'react';
import axios from "axios";
import AddingUser from './addingUser/addingUser';
import UsersList from './UsersList/UsersList';
import {User} from '@/types/user';
import redis from '@/lib/redis'


export async function getServerSideProps(context) {

  const clearChache = context.query.clearCache === 'true';

  if(clearChache){
    try{
      redis.flushall();
    }
  
    catch (error) {
    console.error('Error clearing cache:', error);
  }
  }
    try {
      const response = await axios.get("http://localhost:4000/api/users");
      console.log(response.data);
      const users = response.data;
      return { props: { users } };
    } catch (error) {
      console.error('Server-side fetch error:', error);
      return { props: { users: [] } };
    }
}
interface UsersProps {
    users: User[] 
  }


const Page: React.FC<UsersProps> = ({ users }) => {

  const clearCache = ()=>{
    window.location.href = `${window.location.pathname}?clearCache=true`;
  }

  return (
    <div>
        <UsersList users={users}/>

         <AddingUser/> 
         <div>
          <button onClick={clearCache}>clear cache</button>
         </div>
    </div>
  )
}

export default Page;