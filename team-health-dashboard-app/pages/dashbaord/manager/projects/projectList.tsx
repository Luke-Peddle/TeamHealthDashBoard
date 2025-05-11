import React, {useState} from 'react';
import ProjectDetails from './projectDetails'
import { useRouter } from 'next/router';
import axios from 'axios';

const ProjectList = ({projects, user_id}) => {

    const router = useRouter();
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const newProject = {
            name: name,
            manager: user_id,
           
        }
        console.log(newProject);

        // setMessage({ text: 'Creating project...', type: 'info' });

        axios.post("http://localhost:4000/api/project", newProject) 
        .then(response => {
            console.log('user created successfully:', response.data);
            // setMessage({ text: 'User created successfully!', type: 'success' });
            
            setName('');
           

            setTimeout(() => {
                router.reload();
              }, 1000);
        })
        .catch(error => {
            console.error('There was an error creating the user!', error);

        })
    }
    

  return (
    <div>
         {projects.map(project => (
            <ProjectDetails  project={project} />
          ))}
          <div>
            Create New Project
            <form
            onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="pt-2">
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Add Project
                    </button>
                </div>
            </form>
          </div>
    </div>
  )
}

export default ProjectList