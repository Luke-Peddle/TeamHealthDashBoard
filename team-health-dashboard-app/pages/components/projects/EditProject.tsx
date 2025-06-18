import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Projects } from '@/types/project';

interface EditProjectProps {
   project: Projects;
}

const EditProject: React.FC<EditProjectProps> = ({ project }) => {
   const router = useRouter();
   const queryClient = useQueryClient();
   const [name, setName] = useState('');
   const [message, setMessage] = useState({ text: '', type: '' });
   const { id } = router.query;
   
   console.log('EditProject - Project ID:', id);
   console.log('EditProject - Props project:', project);
   
   useEffect(() => {
       if (project && project.name) {
           setName(project.name);
       }
   }, [project]);

   const updateProjectMutation = useMutation({
       mutationFn: async (updatedProject: Projects) => {
           console.log('Mutation starting for project ID:', id);
           const response = await axios.patch(`http://localhost:4000/api/project/${id}`, updatedProject);
           console.log('Mutation response:', response.data);
           return response.data;
       },
       onMutate: () => {
           console.log('onMutate called');
           setMessage({ text: 'Updating project...', type: 'info' });
       },
       onSuccess: (data) => {
           console.log('onSuccess called with data:', data);
           setMessage({ text: 'Project updated successfully!', type: 'success' });
           
           console.log('Invalidating queries for project ID:', id);
           
           queryClient.invalidateQueries({ queryKey: ['project', id] });
           queryClient.invalidateQueries({ queryKey: ['project', String(id)] });
           queryClient.invalidateQueries({ queryKey: ['projects'] });
           
           console.log('Current cache for project:', queryClient.getQueryData(['project', id]));
           console.log('Current cache for project (string):', queryClient.getQueryData(['project', String(id)]));
           
           setTimeout(() => {
               setMessage({ text: '', type: '' });
           }, 3000);
       },
       onError: (error) => {
           console.error('onError called with error:', error);
           setMessage({ text: 'Error updating the project', type: 'error' });
           
           setTimeout(() => {
               setMessage({ text: '', type: '' });
           }, 5000);
       }
   });

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
       e.preventDefault();
       if (!name.trim()) return;
       
       console.log('Form submitted with name:', name);
       
       const updatedProject = {...project, name: name};
       console.log('Updated project object:', updatedProject);

       updateProjectMutation.mutate(updatedProject);
   }

   const isSubmitting = updateProjectMutation.isPending;

   return (
       <div>
           <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
               Edit Project
           </h3>
       
           {message.text && (
               <div className={`mb-4 p-3 rounded-md text-sm border ${
                   message.type === 'success' ? 'bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700' : 
                   message.type === 'error' ? 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700' : 
                   'bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700'
               }`}>
                   <div className="flex items-center">
                       {message.type === 'success' && (
                           <svg className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                           </svg>
                       )}
                       {message.type === 'error' && (
                           <svg className="h-4 w-4 mr-2 text-red-500 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                           </svg>
                       )}
                       {message.type === 'info' && (
                           <svg className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
                           </svg>
                       )}
                       {message.text}
                   </div>
               </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 items-center">
                       Project Name
                   </label>
                   <input
                       type="text"
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       required
                       disabled={isSubmitting}
                       placeholder="Enter project name"
                       className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                   />
               </div>

               <button 
                   type="submit"
                   disabled={isSubmitting || !name.trim()}
                   className={`w-full text-sm font-medium py-2 px-4 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex justify-center items-center
                   ${isSubmitting || !name.trim() ? 'bg-blue-400 cursor-not-allowed text-white' : 'bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white'}`}
               >
                   {isSubmitting ? (
                       <>
                           
                           Updating...
                       </>
                   ) : "Update Project"}
               </button>
           </form>
       </div>
   )
}

export default EditProject