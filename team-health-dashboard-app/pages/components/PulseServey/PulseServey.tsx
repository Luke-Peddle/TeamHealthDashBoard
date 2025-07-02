import React,{ useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Projects } from '@/types/project';
import { User } from '@/types/user';
import { pulse } from '@/types/Pulse';

interface PusleProps{
    project: Projects
    user_id: number
}

const PulseServey: React.FC<PusleProps> = ({project, user_id}) => {
    const queryClient = useQueryClient();

    const [moodValue, setMoodValue] = useState("");
    const [moodMessage, setMoodMessage] = useState("");
    const [uploadMessage, setUploadMessage] = useState({ text: '', type: '' });

    const createSurveyMutation = useMutation({
        mutationFn: async (newSurvey) => {
            const response = await axios.post("http://localhost:4000/api/pulseSurvey", newSurvey);
            return response.data
        },
        onMutate: () => {
            setUploadMessage({ text: 'Uploading pulse survey...', type: 'info' })
        },
        onSuccess: (data) => {
            console.log('Pulse survey successfully uploaded:', data)
            setUploadMessage({ text: 'Survey submitted successfully!', type: 'success' });

            setMoodValue('');
            setMoodMessage('');
            setTimeout(() => {
                setUploadMessage({ text: '', type: '' });
            }, 3000);
        },
        onError: (error) => {
            console.error('There was an error uploading the survey!', error);
            setUploadMessage({ text: 'Error uploading survey', type: 'error' });

            if(error.response.status === 500){
                setUploadMessage({ text: 'You already uploaded a survey today for this project. Please wait till tomorrow to submit another one', type: 'error' });
            }

            setTimeout(() => {
                setUploadMessage({ text: '', type: '' });
            }, 5000);
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const date = new Date().toISOString().split('T')[0];

        const newSurvey = {
            user_id: user_id,
            project_id: project.id,
            score: moodValue,
            comment: moodMessage,
            day: date
        }

        console.log(newSurvey)
        createSurveyMutation.mutate(newSurvey)
    }

    const isSubmitting = createSurveyMutation.isPending;

    const moodOptions = [
        { value: "1", label: "1", description: "Very unhappy" },
        { value: "2", label: "2", description: "Unhappy" },
        { value: "3", label: "3", description: "Neutral" },
        { value: "4", label: "4", description: "Happy" },
        { value: "5", label: "5", description: "Very happy" }
    ];

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Daily Pulse Survey</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">How are you feeling about the project today?</p>
            </div>

            {uploadMessage.text && (
                <div className={`p-3 rounded-md text-sm border ${
                    uploadMessage.type === 'success' ? 'bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700' :
                    uploadMessage.type === 'error' ? 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700' :
                    'bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700'
                }`}>
                    <div className="flex items-center">
                        {uploadMessage.type === 'success' && (
                            <div className="h-4 w-4 mr-2 text-green-500 dark:text-green-400">✓</div>
                        )}
                        {uploadMessage.type === 'error' && (
                            <div className="h-4 w-4 mr-2 text-red-500 dark:text-red-400">✗</div>
                        )}
                        {uploadMessage.type === 'info' && (
                            <div className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400">ℹ</div>
                        )}
                        {uploadMessage.text}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                        How would you rate your mood today?
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                        {moodOptions.map((option) => (
                            <div key={option.value} className="text-center">
                                <input
                                    type="radio"
                                    id={option.value}
                                    name="moodValue"
                                    value={option.value}
                                    onChange={(e) => setMoodValue(e.target.value)}
                                    required
                                    disabled={isSubmitting}
                                    className="sr-only"
                                />
                                <label
                                    htmlFor={option.value}
                                    className={`block w-full h-20 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
                                        moodValue === option.value
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400'
                                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800'
                                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <div className="text-2xl mb-1 text-gray-900 dark:text-gray-100">{option.label}</div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400 text-center leading-tight">{option.description}</div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Additional comments (optional)
                    </label>
                    <textarea
                        value={moodMessage}
                        onChange={(e) => setMoodMessage(e.target.value)}
                        disabled={isSubmitting}
                        placeholder="Share any thoughts about your day or the project..."
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !moodValue}
                    className={`w-full text-sm font-medium py-3 px-4 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex justify-center items-center
                    ${isSubmitting || !moodValue ? 'bg-blue-400 cursor-not-allowed text-white' : 'bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white'}`}
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Submitting...
                        </div>
                    ) : "Submit Survey"}
                </button>
            </form>
        </div>
    )
}

export default PulseServey