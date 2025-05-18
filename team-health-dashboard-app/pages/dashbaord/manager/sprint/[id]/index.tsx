import React from 'react'
import axios from 'axios'
import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/router';

export async function getServerSideProps(context) {
    const { id } = context.params;
  
    try {
        
      const sprintResponse = await axios.get(`http://localhost:4000/api/sprint/${id}`);
      const sprintList = sprintResponse.data
      const sprint = sprintList[0];
      console.log(sprint)
      return { props: { sprint } };
    } catch (error) {
      console.error('Server-side fetch error:', error);
      return { props: { sprint: {} } };
    }
  }

const index = ({sprint}) => {
  console.log(sprint);
  const startDate = new Date(sprint.start_date);
  const endDate = new Date(sprint.end_date);
  const router = useRouter();

  const [newEndDate, setNewEndDate] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const { id } = router.query;

        const updatedSprint = sprint
        updatedSprint.end_date = newEndDate

        axios.patch(`http://localhost:4000/api/sprint/${id}`, updatedSprint)
        .then(response => {
            console.log('sprint updated successfully:', response.data);
            setMessage({ text: 'Sprint updated successfully!', type: 'success' });
            
            setNewEndDate('');
        })
        .catch(error => {
            console.error('There was an error updating the sprint!', error);
            setMessage({ text: 'Error updating sprint', type: 'error' });
        });
  }

  return (
    <div>
        <h3>
            {startDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            <br/>
            {endDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
        </h3>

        <div>
          {message.text && (
                <div className={`mb-4 p-2 rounded text-sm ${
                    message.type === 'success' ? 'bg-green-100 text-green-800' : 
                    message.type === 'error' ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'
                }`}>
                    {message.text}
                </div>
            )}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="end-date" className="text-sm font-medium text-gray-700">
                        End Date
                    </label>
                    <div className="relative">
                        <Input
                            id="end-date"
                            type="date"
                            value={newEndDate}
                            onChange={(e) => setNewEndDate(e.target.value)}
                            required
                            className="w-full pr-10"
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                    </div>

                      <div className="pt-2">
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                       Update end date
                    </button>
                </div>
            </div>
          </form>
        </div>
    </div>
  )
}

export default index