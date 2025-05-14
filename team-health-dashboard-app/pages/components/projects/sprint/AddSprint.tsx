import React, {useState} from 'react';
import { Input } from "@/components/ui/input"
import axios from 'axios';
import { CalendarIcon } from "lucide-react"
import { useRouter } from 'next/router';

const AddSprint = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { id } = router.query;
        
        const newSprint = {
            start_date: startDate,
            end_date: endDate,
            project_id: id
        }
        console.log(newSprint);

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
        });
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto mt-6">
            <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Add a Sprint</h3>
            
            {message.text && (
                <div className={`mb-4 p-3 rounded-md text-sm ${
                    message.type === 'success' ? 'bg-green-100 text-green-800' : 
                    message.type === 'error' ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'
                }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="start-date" className="text-sm font-medium text-gray-700">
                        Start Date
                    </label>
                    <div className="relative">
                        <Input
                            id="start-date"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                            className="w-full pr-10"
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="end-date" className="text-sm font-medium text-gray-700">
                        End Date
                    </label>
                    <div className="relative">
                        <Input
                            id="end-date"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                            className="w-full pr-10"
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                    </div>
                </div>

                <div className="pt-2">
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Add Sprint
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddSprint