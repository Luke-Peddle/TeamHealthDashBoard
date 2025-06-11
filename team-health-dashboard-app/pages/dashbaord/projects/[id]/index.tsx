import React from 'react'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import PulseSurvey from '@/pages/components/PulseServey/PulseServey';
import { useState } from 'react';
import { X } from 'lucide-react';
import Metrics from '@/pages/components/projects/KPICards/Metrics';
import Charts from '@/pages/components/projects/Charts/Charts';

const user = {
    "user_id": 24,
    "username": "SamSmithy", 
    "password": "Sam1234",
    "first_name": "Sam",
    "last_name": "Smith",
    "email": "sam@gmail.com",
    "role": "contributor"
};

const fetchProject = async (id) => {
        const response = await axios.get(`http://localhost:4000/api/project/${id}`);
        return response.data;
    };

    const fetchSprints = async (id) => {
        const response = await axios.get(`http://localhost:4000/api/sprint/project/${id}`);
        return response.data;
    };

    const fetchTeamMembers = async (id) => {
        const response = await axios.get(`http://localhost:4000/api/users/teamMembers/${id}`);
        return response.data;
    };

    const fetchNonTeamMembers = async (id) => {
        const response = await axios.get(`http://localhost:4000/api/users/nonTeamMembers/${id}`);
        return response.data;
    };

    const fetchVelocity = async (id) => {
        const response = await axios.get(`http://localhost:4000/api/velocity/${id}`);
        return response.data;
    };

    const fetchOnCall = async (id) => {
        const response = await axios.get(`http://localhost:4000/api/oncall/${id}`);
        return response.data;
    };

    const fetchCodeReview = async (id) => {
        const response = await axios.get(`http://localhost:4000/api/codeReview/${id}`);
        return response.data;
    };

    const fetchPulseSurvey = async (id) => {
        const response = await axios.get(`http://localhost:4000/api/pulseSurvey/${id}`);
        return response.data;
    };

 

export async function getServerSideProps(context) {

    const { id } = context.params;
       console.log(id);
       
       try {
           const projectResponse = await axios.get(`http://localhost:4000/api/project/${id}`);
           const sprintResponse = await axios.get(`http://localhost:4000/api/sprint/project/${id}`);
           const teamMembersResponse = await axios.get(`http://localhost:4000/api/users/teamMembers/${id}`);
           const nonTeamMembersResponse = await axios.get(`http://localhost:4000/api/users/nonTeamMembers/${id}`);
           const velocityMetricResponse = await axios.get(`http://localhost:4000/api/velocity/${id}`);
           const onCallMetricsResponse = await axios.get(`http://localhost:4000/api/oncall/${id}`);
           const codeReviewMetricResponse = await axios.get(`http://localhost:4000/api/codeReview/${id}`);
           const pulseResponse = await axios.get(`http://localhost:4000/api/pulseSurvey/${id}`)
           
   
           const project = projectResponse.data;
           const sprints = sprintResponse.data;
           const teamMembers = teamMembersResponse.data;
           const nonTeamMembers = nonTeamMembersResponse.data;
           const velocityMetric = velocityMetricResponse.data;
           const onCallMatrics = onCallMetricsResponse.data;
           const codeReviewMatrics = codeReviewMetricResponse.data;
           const pulseSurvey = pulseResponse.data;
           
           console.log("pulse Surveys data: " +  pulseResponse.data);
           
           return { 
               props: { 
                   project, 
                   sprints, 
                   teamMembers, 
                   nonTeamMembers,
                   projectId: id,
                   velocityMetric,
                   onCallMatrics,
                   codeReviewMatrics,
                   pulseSurvey
               } 
           };
       } catch (error) {
           console.error('Server-side fetch error:', error);
           return { 
               props: { 
                   project: {}, 
                   sprints: [], 
                   teamMembers: [], 
                   nonTeamMembers: [],
                   projectId: id,
                   velocityMetric: [],
                   onCallMatrics: [],
                   codeReviewMatrics: [],
                   pulseSurvey: []
               } 
           };
       }
}

const Index = ({ project: initialProject, sprints: initialSprints, teamMembers: initialTeamMembers, nonTeamMembers: initialNonTeamMembers, projectId, velocityMetric: initialVelocityMetric, onCallMatrics: initialOnCallMetric, codeReview: initalCodeReview, pulseSurvey: initialPulseSurvey }) => {
   
    const [openPulseSurvey, setPulseSurvey] = useState(false);

    const { data: project, isLoading: projectLoading } = useQuery({
        queryKey: ['project', projectId],
        queryFn: () => fetchProject(projectId),
        initialData: initialProject,
        staleTime: 2 * 60 * 1000, 
    });

    const { data: sprints } = useQuery({
        queryKey: ['sprints', projectId],
        queryFn: () => fetchSprints(projectId),
        initialData: initialSprints,
        staleTime: 30 * 1000, 
    });

    const { data: teamMembers } = useQuery({
        queryKey: ['teamMembers', projectId],
        queryFn: () => fetchTeamMembers(projectId),
        initialData: initialTeamMembers,
        staleTime: 5 * 60 * 1000,
    });

    const { data: nonTeamMembers } = useQuery({
        queryKey: ['nonTeamMembers', projectId],
        queryFn: () => fetchNonTeamMembers(projectId),
        initialData: initialNonTeamMembers,
        staleTime: 5 * 60 * 1000, 
    });

    const { data: velocityMetric } = useQuery({
        queryKey: ['velocityMetrics', projectId],
        queryFn: () => fetchVelocity(projectId),
        initialData: initialVelocityMetric,
        staleTime: 5 * 60 * 1000, 
    });

     const { data: onCallMatrics } = useQuery({
        queryKey: ['onCallMatrics', projectId],
        queryFn: () => fetchOnCall(projectId),
        initialData: initialOnCallMetric,
        staleTime: 5 * 60 * 1000, 
    });
    const { data: codeReviewMatrics } = useQuery({
        queryKey: ['codeReviewMetrics', projectId],
        queryFn: () => fetchCodeReview(projectId),
        initialData: initalCodeReview,
        staleTime: 5 * 60 * 1000, 
    });
    const { data: pulseSurvey } = useQuery({
        queryKey: ['pulseSurvey', projectId],
        queryFn: () => fetchPulseSurvey(projectId),
        initialData: initialPulseSurvey,
        staleTime: 5 * 60 * 1000, 
    })

    const handleSurvey = () => {
        setPulseSurvey(true);
    }

    const handleCloseSurvey = () => {
        setPulseSurvey(false)
    }

    const getCurrentSprint = () =>{
         if (!sprints || sprints.length === 0) return null;

        const today = new Date()

        today.setHours(0, 0, 0, 0);

        const currentSprint = sprints.find(sprint =>{

            console.log("Sprint in find: " + JSON.stringify(sprint))
            console.log('today: ' + today)

            const startDate = new Date(sprint.start_date);
            const endDate = new Date(sprint.end_date);

            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
        
            return today >= startDate && today <= endDate;
        });

        console.log("Current sprint in function: " + currentSprint)

        return currentSprint || null;
    }

    let currentSprint = getCurrentSprint();


    if(!currentSprint && sprints.length > 0){
        currentSprint = sprints[0]

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

             <div className="px-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                Current Sprint: {currentSprint?.name || 'No active sprint'}
                            </h2>
                        </div>
                        
                        {currentSprint && (
                            <Metrics 
                                velocityMetric={velocityMetric} 
                                onCallMetrics={onCallMatrics} 
                                codeReviewMetrics={codeReviewMatrics} 
                                pulseScores={pulseSurvey}
                                sprint_id={currentSprint.id} 
                            />
                        )}
                    </div>
                </div>

                 <div className="px-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        
                        <Charts 
                            velocityMetrics={velocityMetric} 
                            incidents={onCallMatrics} 
                            codeReview={codeReviewMatrics} 
                            users={teamMembers} 
                            sprints={sprints} 
                            pulseSurveys={pulseSurvey}
                            userRole = {user.role}
                        />
                    </div>
                </div>
        </div>
    )
}

export default Index