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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const { id } = router.query;

        // Create a copy to avoid direct mutation
        const updatedSprint = { ...sprint, end_date: newEndDate };

        axios.patch(`http://localhost:4000/api/sprint/${id}`, updatedSprint)
        .then(response => {
            console.log('sprint updated successfully:', response.data);
            setMessage({ text: 'Sprint updated successfully!', type: 'success' });
            setNewEndDate('');
        })
        .catch(error => {
            console.error('There was an error updating the sprint!', error);
            setMessage({ text: 'Error updating sprint', type: 'error' });
        })
        .finally(() => {
            setIsSubmitting(false);
        });
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Sprint Details
                </h3>
                
                <div className="mb-6 space-y-2">
                    <div className="flex items-center text-gray-700">
                        <CalendarIcon className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="text-sm font-medium mr-2">Start Date:</span>
                        <span>
                            {startDate.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                        <CalendarIcon className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="text-sm font-medium mr-2">End Date:</span>
                        <span>
                            {endDate.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">
                        Update End Date
                    </h4>
                    
                    {message.text && (
                        <div className={`mb-4 p-3 rounded-md text-sm ${
                            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-100' : 
                            message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-100' : 
                            'bg-blue-50 text-blue-800 border border-blue-100'
                        }`}>
                            {message.text}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
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
                        </div>

                        <div>
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
                                text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex justify-center items-center`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : "Update end date"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default index