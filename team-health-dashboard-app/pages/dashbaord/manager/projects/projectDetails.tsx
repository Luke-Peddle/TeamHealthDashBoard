import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router';
import { X, Folder, Loader2 } from 'lucide-react';
import {User} from '@/types/user';
import axios from 'axios';
import { Projects } from '@/types/project';

interface projectProps{
project: Projects
user_id: number
}

const ProjectDetails: React.FC<projectProps> = ({project, user_id}) => {
    const queryClient = useQueryClient();
    const [showConfirm, setShowConfirm] = useState(false);

    const deleteProjectMutation = useMutation({
        mutationFn: async () => {
            await axios.delete(`http://localhost:4000/api/project/${project.id}/${user_id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', user_id] });
            queryClient.invalidateQueries({ queryKey: ['projects', String(user_id)] });
            setShowConfirm(false);
        },
        onError: (error) => {
            console.error('Server-side delete error:', error);
            setShowConfirm(false);
        }
    });

    const handleDeleteClick = () => {
        setShowConfirm(true);
    };

    const handleConfirmDelete = () => {
        deleteProjectMutation.mutate();
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
    };

    const isDeleting = deleteProjectMutation.isPending;
    
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
                onClick={handleDeleteClick}
                disabled={isDeleting}
                title="Delete project"
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors disabled:opacity-50"
                aria-label="Delete project"
            >
                {isDeleting ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : (
                    <X size={16} />
                )}
            </button>
            
            {showConfirm && (
                <div className="absolute inset-0 bg-white bg-opacity-95 rounded-lg flex items-center justify-center border-2 border-red-200">
                    <div className="text-center p-4">
                        <p className="text-sm text-gray-700 mb-3">
                            Delete "{project.name}"?
                        </p>
                        <div className="flex gap-2 justify-center">
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
                            >
                                {isDeleting && <Loader2 size={12} className="animate-spin" />}
                                Delete
                            </button>
                            <button
                                onClick={handleCancelDelete}
                                disabled={isDeleting}
                                className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProjectDetails