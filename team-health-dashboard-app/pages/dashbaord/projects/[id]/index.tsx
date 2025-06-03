import React from 'react'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import PulseSurvey from '@/pages/components/PulseServey/PulseServey';
import { useState } from 'react';
import { X, BarChart3 } from 'lucide-react';

const user = {
    "user_id": 26,
    "username": "SamSmithy", 
    "password": "Sam1234",
    "first_name": "Sam",
    "last_name": "Smith",
    "email": "sam@gmail.com",
    "role": "contributor"
};

export async function getServerSideProps(context) {
    const { id } = context.params;

    try {
        const projectResponse = await axios.get(`http://localhost:4000/api/project/${id}`);
        const project = projectResponse.data;

        return {
            props: {
                project
            }
        };
    }
    catch (error) {
        console.error('Server-side fetch error:', error);

        return {
            props: {
                project: [],
            }
        };
    };
}

const Index = ({ project }) => {
    const [openPulseSurvey, setPulseSurvey] = useState(false);

    const handleSurvey = () => {
        setPulseSurvey(true);
    }

    const handleCloseSurvey = () => {
        setPulseSurvey(false)
    }

    return (
        <div className="p-6">
            <button
                onClick={handleSurvey}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
               
                <span>Take Pulse Survey</span>
            </button>

            {openPulseSurvey && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                        onClick={handleCloseSurvey}
                    ></div>
                    
                    <div className="flex min-h-full items-center justify-center p-4">
                        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                            <button
                                onClick={handleCloseSurvey}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 z-10"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                            
                            <div className="p-6 pt-12">
                                <PulseSurvey project={project} user={user} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Index