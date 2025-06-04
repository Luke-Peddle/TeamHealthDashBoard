import React from 'react';
import axios from "axios";
import AddingUser from './addingUser/addingUser';
import UsersList from './UsersList/UsersList';
import {User} from '@/types/user';
import { useQuery } from '@tanstack/react-query';


const fetchUsers = async (id) => {
    const response = await axios.get(`http://localhost:4000/api/users`);
    return response.data;
};

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

const Page: React.FC<UsersProps> = ({ users:intialUsers }) => {
  const clearCache = () => {
     axios.get("http://localhost:4000/api/cache/clearCache" )
     .then(response => {
      console.log('Cache Cleared: ' +  response.data);
      
    })
  .catch(error => {
      console.error('There was an error clearing the cache', error);
  });
  }

  const { data: users, isLoading: projectLoading } = useQuery({
          queryKey: ['users'],
          queryFn: () => fetchUsers(),
          initialData: initialProject,
          staleTime: 2 * 60 * 1000, 
      });

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        

        <div className="flex justify-center ">
          <div className="lg:col-span-3">
            <UsersList users={users}/>
            <br/>
            
            
         
          </div>
          
          
        </div>
        <div className="lg:col-span-2">
            <AddingUser /> 
            <div className="mt-4 flex justify-center">
              <button 
                onClick={clearCache}
                className="flex items-center px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors duration-150 text-sm"
              >
                Clear Cache
              </button>
            </div>
          </div>
      </div>
    </div>
  )
}

export default Page;