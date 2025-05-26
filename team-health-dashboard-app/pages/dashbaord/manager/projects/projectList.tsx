import React, {useState} from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ProjectDetails from './projectDetails'
import { useRouter } from 'next/router';
import axios from 'axios';
import { PlusCircle } from 'lucide-react';

const ProjectList = ({projects, user_id}) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isFormOpen, setIsFormOpen] = useState(false);

    const createProjectMutation = useMutation({
        mutationFn: async (newProject) => {
            const response = await axios.post("http://localhost:4000/api/project", newProject);
            return response.data;
        },
        onMutate: () => {
            setMessage({ text: 'Creating project...', type: 'info' });
        },
        onSuccess: (data) => {
            console.log('Project created successfully:', data);
            setMessage({ text: 'Project created successfully!', type: 'success' });
            setName('');
            
            queryClient.invalidateQueries({ queryKey: ['projects', user_id] });
            queryClient.invalidateQueries({ queryKey: ['projects', String(user_id)] });
            
            setTimeout(() => {
                setMessage({ text: '', type: '' });
                setIsFormOpen(false);
            }, 2000);
        },
        onError: (error) => {
            console.error('There was an error creating the project!', error);
            setMessage({ text: 'Error creating project', type: 'error' });
            
            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 5000);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        
        const newProject = {
            name: name,
            manager: user_id,
        }

        createProjectMutation.mutate(newProject);
    }

    const isSubmitting = createProjectMutation.isPending;
    
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Your Projects</h2>
                <button 
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="flex items-center text-sm font-medium px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                    {isFormOpen ? 'Cancel' : (
                        <>
                            <PlusCircle size={16} className="mr-1.5" />
                            New Project
                        </>
                    )}
                </button>
            </div>
            
            {message.text && (
                <div className={`mb-4 p-3 rounded-md text-sm ${
                    message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-100' : 
                    message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-100' : 
                    'bg-blue-50 text-blue-800 border border-blue-100'
                }`}>
                    {message.text}
                </div>
            )}
            
            {isFormOpen && (
                <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Create New Project</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        <div>
                            <button 
                                type="submit"
                                disabled={isSubmitting || !name.trim()}
                                className={`w-full ${isSubmitting || !name.trim() ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
                                text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex justify-center items-center`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </>
                                ) : "Create Project"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            <div className="space-y-3">
                {projects && projects.length > 0 ? (
                    projects.map(project => (
                        <ProjectDetails key={project.id} project={project} user_id = {user_id} />
                    ))
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500">No projects yet. Create your first project!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProjectList