import React from 'react'
import {  Folder } from 'lucide-react';
import { Projects } from '@/types/project';

interface projectProps{
project: Projects
user_id: number
}

const ProjectDetails: React.FC<projectProps> = ({project, user_id}) => {
    
    
    return (
        <div className="group bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-4 mb-3 relative">
            <a 
                href={`http://localhost:3000/dashbaord/projects/${project.id}`} 
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

           
            
        </div>
    )
}

export default ProjectDetails