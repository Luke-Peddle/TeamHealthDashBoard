import React, {useState} from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ProjectDetails from './ProjectDetails'
import { useRouter } from 'next/router';
import axios from 'axios';
import { PlusCircle } from 'lucide-react';
import { Projects } from '@/types/project';

interface ProjectProps{
    projects: Projects[],
    user_id: number
}

const ContributorProjectList: React.FC<ProjectProps> = ({projects, user_id}) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-200">Your Projects</h2>
            </div>
            
            <div className="space-y-3">
                {projects && projects.length > 0 ? (
                    projects.map(project => (
                        <ProjectDetails key={project.id} project={project} user_id={user_id} />
                    ))
                ) : (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 transition-colors duration-200">
                        <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">You are not a member of any projects</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ContributorProjectList