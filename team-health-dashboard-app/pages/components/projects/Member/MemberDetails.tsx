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
        <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center space-x-2">
                
                <h3 className="font-medium text-gray-800">
                    {props.member.first_name} {props.member.last_name}
                </h3>
            </div>
            <button 
                onClick={deleteMember}
                className="text-sm px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors duration-200 flex items-center"
            >
                Remove
            </button>
        </div>
    )
}

export default MemberDetails