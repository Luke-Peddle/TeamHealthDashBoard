import React, {useState} from 'react';
import { Input } from "@/components/ui/input"
import axios from 'axios';
import { CalendarIcon } from "lucide-react"
import { useRouter } from 'next/router';

const AddSprint = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const { id } = router.query;
        
        const newSprint = {
            start_date: startDate,
            end_date: endDate,
            project_id: id
        }

        setMessage({ text: 'Creating sprint...', type: 'info' });

        axios.post("http://localhost:4000/api/sprint", newSprint) 
        .then(response => {
            console.log('sprint created successfully:', response.data);
            setMessage({ text: 'Sprint created successfully!', type: 'success' });
            
            setStartDate('');
            setEndDate('');
        })
        .catch(error => {
            console.error('There was an error creating the sprint!', error);
            setMessage({ text: 'Error creating sprint', type: 'error' });
        })
        .finally(() => {
            setIsSubmitting(false);
        });
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                
                Add a Sprint
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
                <div >
                    <div className="space-y-2">
                        <label htmlFor="start-date" className="text-sm font-medium text-gray-700 flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                            Start Date
                        </label>
                        <div className="relative">
                            <Input
                                id="start-date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="end-date" className="text-sm font-medium text-gray-700 flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                            End Date
                        </label>
                        <div className="relative">
                            <Input
                                id="end-date"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex justify-center items-center`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating...
                            </>
                        ) : "Add Sprint"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddSprint