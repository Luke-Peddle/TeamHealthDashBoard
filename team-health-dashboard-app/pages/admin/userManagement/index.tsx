import React from 'react';
import axios from "axios";
import AddingUser from './addingUser/addingUser';
import UsersList from './UsersList/UsersList';
import {User} from '@/types/user';

export async function getServerSideProps() {
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
  return (
    <div>
        <UsersList users={users}/>

         <AddingUser/> 
    </div>
  )
}

export default Page;