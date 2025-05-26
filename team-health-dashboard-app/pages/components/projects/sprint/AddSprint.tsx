import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const EditProject = (props) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const { id } = router.query;
    
    // Set initial value from props
    useEffect(() => {
        if (props.project && props.project.name) {
            setName(props.project.name);
        }
    }, [props.project]);

    // Update project mutation
    const updateProjectMutation = useMutation({
        mutationFn: async (updatedProject) => {
            const response = await axios.patch(`http://localhost:4000/api/project/${id}`, updatedProject);
            return response.data;
        },
        onMutate: () => {
            setMessage({ text: 'Updating project...', type: 'info' });
        },
        onSuccess: (data) => {
            console.log('Project updated', data);
            setMessage({ text: 'Project updated successfully!', type: 'success' });
            
            queryClient.invalidateQueries({ queryKey: ['project', id] });
            
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            
            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 3000);
        },
        onError: (error) => {
            console.error('There was an error updating the project!', error);
            setMessage({ text: 'Error updating the project', type: 'error' });
            
            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 5000);
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name.trim()) return;
        
        const updatedProject = {...props.project, name: name};

        updateProjectMutation.mutate(updatedProject);
    }

    const isSubmitting = updateProjectMutation.isPending;

    return (
        <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                Edit Project
            </h3>
            
            {message.text && (
                <div className={`mb-4 p-3 rounded-md text-sm ${
                    message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
                    message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 
                    'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                    <div className="flex items-center">
                        {message.type === 'success' && (
                            <svg className="h-4 w-4 mr-2 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        )}
                        {message.type === 'error' && (
                            <svg className="h-4 w-4 mr-2 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        )}
                        {message.type === 'info' && (
                            <svg className="h-4 w-4 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
                            </svg>
                        )}
                        {message.text}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        Project Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isSubmitting}
                        placeholder="Enter project name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </div>

                <div className="pt-2">
                    <button 
                        type="submit"
                        disabled={isSubmitting || !name.trim()}
                        className={`w-full ${isSubmitting || !name.trim() ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex justify-center items-center`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </>
                        ) : "Update Project Name"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditProject