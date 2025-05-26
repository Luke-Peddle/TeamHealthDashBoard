import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios';
import ProjectList from './manager/projects/projectList';

const user = {
  "user_id": 5,
  "username": "Luke Peddle",
  "password": "Luke5341",
  "first_name": "Luke",
  "last_name": "Peddle",
  "email": "lukePeddle@gmail.com",
  "role": "manager"
};

const fetchProjects = async (userId) => {
  const response = await axios.get(`http://localhost:4000/api/project/manager/${userId}`);
  return response.data;
};

function toPlainObject(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => toPlainObject(item));
  }
  
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  
  if (typeof obj === 'object' && typeof obj.toJSON === 'function') {
    return toPlainObject(obj.toJSON());
  }
  
  if (typeof obj === 'object') {
    const plain = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === 'function' || typeof value === 'symbol') {
          continue;
        }
        plain[key] = toPlainObject(value);
      }
    }
    return plain;
  }
  
  return obj;
}

export async function getServerSideProps() {
  console.log('enter')
  try {
    const response = await axios.get(`http://localhost:4000/api/project/manager/${user.user_id}`);
    console.log(response.data);
    const projects = toPlainObject(response.data);
    return { 
      props: { 
        projects: projects || [],
        userId: user.user_id
      } 
    };
  } catch (error) {
    console.error('Server-side fetch error:', error);
    return { 
      props: { 
        projects: [],
        userId: user.user_id
      } 
    };
  }
}

const Index = ({projects: initialProjects, userId}) => {
  const { data: projects } = useQuery({
    queryKey: ['projects', userId],
    queryFn: () => fetchProjects(userId),
    initialData: initialProjects,
    staleTime: 2 * 60 * 1000,
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Dashboard</h1>
      
      {user.role === "manager" ? (
        <div>
          <ProjectList projects={projects} user_id={user.user_id} />
        </div>
      ) : (
        <div>
          <p className="text-gray-600">Contributor dashboard</p>
        </div>
      )}
    </div>
  )
}

export default Index