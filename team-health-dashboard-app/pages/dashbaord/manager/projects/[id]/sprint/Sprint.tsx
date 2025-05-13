import React from 'react'
import axios from 'axios';

export async function getServerSideProps(context) {
    const { id } = context.params;
  
    try {
      const response = await axios.get(`http://localhost:4000/api/sprint/project/${id}`);
      const sprints = response.data;
      return { props: { sprints } };
    } catch (error) {
      console.error('Server-side fetch error:', error);
      return { props: { sprints: [],  } };
    }
  }

const Sprint = (sprints) => {
  console.log("sprints: " + sprints[0]);
  return (
    // <div>{sprints[0].start_date}</div>
    <div></div>
  )
}

export default Sprint