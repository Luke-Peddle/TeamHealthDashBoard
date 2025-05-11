import React from 'react'
import axios from 'axios';
import Sprint from './sprint/Sprint';

export async function getServerSideProps(context) {
    const { id } = context.params;
  
    try {
        [];
      const projectResponse = await axios.get(`http://localhost:4000/api/project/manager/${id}`);
      console.log(projectResponse.data);
      const projects = projectResponse.data;
      return { props: { projects } };
    } catch (error) {
      console.error('Server-side fetch error:', error);
      return { props: { projects: [],  } };
    }
  }

const index = () => {
  return (
    <div>
        <Sprint />
    </div>
  )
}

export default index