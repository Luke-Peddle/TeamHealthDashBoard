import React from 'react'
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const EditProject = (props) => {
    const router = useRouter();

    const[name, setName] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(props.project);

        const { id } = router.query;
        const updatedProject = props.project;
        updatedProject.name = name;
        console.log(updatedProject);

        axios.patch(`http://localhost:4000/api/project/${id}`, updatedProject)
        .then(response => {
            console.log('project updated', response.data);
            setMessage({ text: 'project updated successfully!', type: 'success' });
            
            setName('');
        })
        .catch(error => {
            console.error('There was an error updating the project!', error);
            setMessage({ text: 'Error updating the project', type: 'error' });
        });

    }
  return (
    <div>
        <div>
            change Project Name
            <br/>

            <form  onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Name
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
                        Change Name
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default EditProject