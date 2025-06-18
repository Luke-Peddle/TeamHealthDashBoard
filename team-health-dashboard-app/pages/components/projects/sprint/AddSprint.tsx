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
    story_point_target: string
}

const AddSprint = ({sprints}) => {
    const [name, setName] = useState('')
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [storypointTarget, setStorypointTarget] = useState('');
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
            name: name,
            story_point_target: storypointTarget
        }

        createSprintMutation.mutate(newSprint);
    }

    const isSubmitting = createSprintMutation.isPending;

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Add Sprint
            </h3>
            
            {message.text && (
                <div className={`mb-4 p-3 rounded-md text-sm border ${
                    message.type === 'success' ? 'bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700' : 
                    message.type === 'error' ? 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700' : 
                    'bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700'
                }`}>
                    <div className="flex items-center">
                      
                        {message.text}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Sprint Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isSubmitting}
                        placeholder="Enter sprint name"
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Story Point Target
                    </label>
                    <input
                        type="text"
                        value={storypointTarget}
                        onChange={(e) => setStorypointTarget(e.target.value)}
                        required
                        disabled={isSubmitting}
                        placeholder="Enter story point target"
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="start-date" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                        Start Date
                    </label>
                    <Input
                        id="start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="w-full text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="end-date" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                        End Date
                    </label>
                    <Input
                        id="end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="w-full text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full text-sm font-medium py-2 px-4 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex justify-center items-center
                    ${isSubmitting ? 'bg-blue-400 cursor-not-allowed text-white' : 'bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white'}`}
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