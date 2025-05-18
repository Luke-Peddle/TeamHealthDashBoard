import React from 'react'
import axios from 'axios';
import { useRouter } from 'next/router';

const MemberDetails = (props) => {

    const router = useRouter();

    const deleteMember = async () => {
         const { id } = router.query;
    try {
       await axios.delete(`http://localhost:4000/api/users/removeMember/${id}/${props.member.user_id}`);
    } catch (error) {
      console.error('Server-side delete error:', error);
    }
}
  return (
    <div>
        <h3>{props.member.first_name} {props.last_name}</h3>
        <button onClick={deleteMember}> delete Member</button>
        
    </div>
  )
}

export default MemberDetails