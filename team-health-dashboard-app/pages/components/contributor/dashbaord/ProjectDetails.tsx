import React from 'react'
import {  Folder } from 'lucide-react';
import { Projects } from '@/types/project';

interface projectProps{
project: Projects
user_id: number
}

const ProjectDetails: React.FC<projectProps> = ({project, user_id}) => {
    
    
    return (
        <div className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md dark:hover:shadow-gray-700/20 transition-all duration-200 p-4 mb-3 relative">
            <a 
                href={`http://localhost:3000/dashbaord/projects/${project.id}`} 
                className="block"
            >
                <div className="flex items-center">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg mr-3 transition-colors duration-200">
                        <Folder size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {project.name}
                        </h3>
                    </div>
                </div>
            </a>
        </div>
    )
}

export default ProjectDetails