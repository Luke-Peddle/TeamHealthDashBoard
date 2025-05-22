import React from 'react'
import { useRouter } from 'next/router'
import  axios from 'axios'
import { X } from 'lucide-react';


const Sprint = (props) => {
  const startDate = new Date(props.sprint.start_date)
  const endDate = new Date(props.sprint.end_date)
  const router = useRouter();
  const id = props.sprint.id
  const project_id = props.project_id
  console.log("Sprint project id: " + project_id)


  const deleteSprint = async () => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/sprint/${id}/${ project_id}`);
      router.reload();
    } catch (error) {
      console.error('Server-side delete error:', error);
    }
  }
    return (
        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
            <a 
                href={`http://localhost:3000/dashbaord/manager/sprint/${props.sprint?.id}`}
                className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors"
            >
                {props.sprint.name}
                <br/>
                {startDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'})}- {endDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'})}
            </a>

            <button 
                    onClick={deleteSprint}
                    title="Delete sprint"
                  >
                    <X size={14} />
                  </button>
            
        </div>
    )
}

export default Sprint