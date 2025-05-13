import React from 'react'
import { useRouter } from 'next/router';
import { X } from 'lucide-react';
import {User} from '@/types/user';
import axios from 'axios';

const ProjectDetails = ({project}) => {
    const router = useRouter();

    const deleteProject = async () => {
        try {
          const response = await axios.delete(`http://localhost:4000/api/project/${project.id}`);
          router.reload();
        } catch (error) {
          console.error('Server-side delete error:', error);
        }
      }
    
  return (
    <div className="group relative">
            <a href ={`http://localhost:3000/dashbaord/manager/projects/${project.id}`} className="block">
        <h3>{project.name}</h3>
        </a>

         <button 
                onClick={deleteProject}
                title="Delete project"
              >
                <X size={14} />
              </button>
    </div>
  )
}

export default ProjectDetails