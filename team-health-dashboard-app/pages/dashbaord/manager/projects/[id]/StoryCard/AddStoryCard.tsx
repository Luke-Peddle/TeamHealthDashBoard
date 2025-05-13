import React, {useState} from 'react';
import axios from 'axios'
import { useRouter } from 'next/router';


const AddStoryCard = () => {

    const [description, setDiscription] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });

            const router = useRouter();

    

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

         e.preventDefault();
        const { id } = router.query;

        
        const newStoryCard = {
            discription: description,
            project: id
           
        }
        console.log(newStoryCard);

        setMessage({ text: 'Creating story card...', type: 'info' });

        axios.post("http://localhost:4000/api/storyCard", newStoryCard) 
        .then(response => {
            console.log('story card created successfully:', response.data);
            setMessage({ text: 'story card created successfully!', type: 'success' });
            
            setDiscription('');
            

          
        })
        .catch(error => {
            console.error('There was an error creating the story card!', error);
            setMessage({ text: 'Error creating story card', type: 'error' });
        });
    }
    
  return (
    <div>
        <div>
             <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
            <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Create a New User</h3>
            
            {message.text && (
                <div className={`mb-4 p-2 rounded text-sm ${
                    message.type === 'success' ? 'bg-green-100 text-green-800' : 
                    message.type === 'error' ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'
                }`}>
                    {message.text}
                </div>
            )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discription
                    </label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDiscription(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                 <div className="pt-2">
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Add Story Card
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default AddStoryCard