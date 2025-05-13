import React from 'react'
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

export async function getServerSideProps() {
  console.log('enter')
  try {
    const response = await axios.get(`http://localhost:4000/api/project/manager/${user.user_id}`);
    console.log(response.data);
    const projects = response.data;
    return { props: { projects } };
  } catch (error) {
    console.error('Server-side fetch error:', error);
    return { props: { projects: [] } };
  }
}

const index  = ({projects}) => {
  


  return (
    <div>index
      {user.role === "manager" ? (
        <div>
          <ProjectList projects = {projects} user_id ={user.user_id} />
        </div>
      ): (
        <div>contributor</div>

      )}
    </div>
  )
}

export default index