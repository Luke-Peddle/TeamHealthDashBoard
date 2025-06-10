import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CalendarIcon } from "lucide-react"
import { useRouter } from 'next/router';

interface NewSprintData {
    start_date: string;
    end_date: string;
    project_id: string | number;
    name: string;
}

const AddSprint = ({sprints}) => {
    const [name, setName] = useState('')
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    
    const router = useRouter();
    const queryClient = useQueryClient();
    const { id } = router.query;

    const checkDataOverLap =(startDate: string, endDate: string): boolean =>{

        const start = new Date(startDate);
        const end = new Date(endDate);

        return sprints.some(sprint => {
            const sprintStart = new Date(sprint.start_date);
            const sprintEnd = new Date(sprint.end_date);

            return (
                  (start >= sprintStart && start <= sprintEnd) ||
                (end >= sprintStart && end <= sprintEnd)     ||
                (start <= sprintStart && end >= sprintEnd)
            )
        })
    }

    const createSprintMutation = useMutation<any, Error, NewSprintData>({
        mutationFn: async (newSprint) => {
            const response = await axios.post("http://localhost:4000/api/sprint", newSprint);
            return response.data;
        },
        onMutate: () => {
            setMessage({ text: 'Creating sprint...', type: 'info' });
        },
        onSuccess: (data) => {
            console.log('Sprint created successfully:', data);
            setMessage({ text: 'Sprint created successfully!', type: 'success' });
            
            setStartDate('');
            setEndDate('');
            setName('');
            
            queryClient.invalidateQueries({ queryKey: ['sprints', id] });
            queryClient.invalidateQueries({ queryKey: ['sprints', String(id)] });
            queryClient.invalidateQueries({ queryKey: ['project', id] });
            queryClient.invalidateQueries({ queryKey: ['project', String(id)] });
            
            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 3000);
        },
        onError: (error) => {
            console.error('There was an error creating the sprint!', error);
            setMessage({ text: 'Error creating sprint', type: 'error' });
            
            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 5000);
        }
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!id || Array.isArray(id)) {
        console.error('Invalid project ID');
        return;
    }

    if(endDate <= startDate){
         setMessage({ text: 'End Date is before Start Date', type: 'error' });
          setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 5000);
            return;
    }

    if(checkDataOverLap(startDate, endDate)){
         setMessage({ 
                text: 'Sprint dates overlap with an existing sprint. Please choose different dates.', type: 'error' });
            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 5000);
            return;
    }
        
        const newSprint: NewSprintData = {
            start_date: startDate,
            end_date: endDate,
            project_id: id,
            name: name
        }

        createSprintMutation.mutate(newSprint);
    }

    const isSubmitting = createSprintMutation.isPending;

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Add Sprint
            </h3>
            
            {message.text && (
                <div className={`mb-4 p-3 rounded-md text-sm border ${
                    message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 
                    message.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : 
                    'bg-blue-50 text-blue-800 border-blue-200'
                }`}>
                    <div className="flex items-center">
                      
                        {message.text}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sprint Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isSubmitting}
                        placeholder="Enter sprint name"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="start-date" className="text-sm font-medium text-gray-700 flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                        Start Date
                    </label>
                    <Input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="w-full text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="end-date" className="text-sm font-medium text-gray-700 flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                        End Date
                    </label>
                    <Input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="w-full text-sm"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full text-sm font-medium py-2 px-4 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex justify-center items-center
                    ${isSubmitting ? 'bg-blue-400 cursor-not-allowed text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                    {isSubmitting ? (
                        <>
                           
                            Creating...
                        </>
                    ) : "Add Sprint"}
                </button>
            </form>
        </div>
    )
}

export default AddSprint