import React from 'react'
import { useRouter } from 'next/router';
import { X, Folder } from 'lucide-react';
import {User} from '@/types/user';
import axios from 'axios';

const ProjectDetails = ({project, user_id}) => {
    const router = useRouter();

    const deleteProject = async () => {
        try {
          await axios.delete(`http://localhost:4000/api/project/${project.id}/${user_id}`);
          router.reload();
        } catch (error) {
          console.error('Server-side delete error:', error);
        }
    }
    
    return (
        <div className="group bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-4 mb-3 relative">
            <a 
                href={`http://localhost:3000/dashbaord/manager/projects/${project.id}`} 
                className="block"
            >
                <div className="flex items-center">
                    <div className="bg-blue-50 p-2 rounded-lg mr-3">
                        <Folder size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                            {project.name}
                        </h3>
                    </div>
                </div>
            </a>

            <button 
                onClick={deleteProject}
                title="Delete project"
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors"
                aria-label="Delete project"
            >
                <X size={16} />
            </button>
        </div>
    )
}

export default ProjectDetails