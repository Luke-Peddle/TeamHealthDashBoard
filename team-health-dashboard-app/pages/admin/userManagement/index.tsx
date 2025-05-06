import React from 'react';
import axios from "axios";
import AddingUser from './addingUser/addingUser';
import UsersList from './UsersList/UsersList';
import {User} from '@/types/user';
import redis from '@/lib/redis';
import { RefreshCw } from 'lucide-react';

export async function getServerSideProps(context) {
  const clearCache = context.query.clearCache === 'true';

  if(clearCache){
    try{
      redis.flushall();
    } catch (error) {
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
  const clearCache = () => {
    window.location.href = `${window.location.pathname}?clearCache=true`;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your system users and their permissions</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <UsersList users={users}/>
            
            <div className="mt-4 flex justify-end">
              <button 
                onClick={clearCache}
                className="flex items-center px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors duration-150 text-sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Cache
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <AddingUser /> 
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page;