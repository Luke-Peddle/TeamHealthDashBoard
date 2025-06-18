import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import SidePanel from '@/pages/components/projects/SidePannel/SidePAnnel';
import VelocityUploader from '@/pages/components/Uploader/velocityUploader';
import CodeReviewUploader from '@/pages/components/CodeReview/CodeReviewUploader';
import Oncall from '@/pages/components/Oncall/Oncall';
import { Button } from '@/components/ui/button';
import { Menu, ChevronRight } from 'lucide-react';
import Metrics from '@/pages/components/projects/KPICards/Metrics';
import Charts from '@/pages/components/projects/Charts/Charts';
import ContributorChart from '@/pages/components/contributorChart/ContributorChart';
import { ToastContainer, toast } from 'react-toastify';
import { useTheme } from 'next-themes';

const manager = {
    "user_id": 5,
    "username": "Luke Peddle",
    "password": "Luke5341",
    "first_name": "Luke",
    "last_name": "Peddle",
    "email": "lukePeddle@gmail.com",
    "role": "manager",
    "dark_mode": false
}

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
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
    });

    const getCurrentSprint = () => {
        if (!sprints || sprints.length === 0) return null;

        const today = new Date()
        today.setHours(0, 0, 0, 0);

        const currentSprint = sprints.find(sprint => {
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

    console.log("Current sprint: " + currentSprint)

    if(!currentSprint && sprints.length > 0){
        currentSprint = sprints[0]
    }
        
    let avgePulseScore = 0;

    pulseSurvey.forEach((pulse) => {
        avgePulseScore += pulse.score;
    });

    avgePulseScore = avgePulseScore/pulseSurvey.length;
    
    console.log('Pulse Survey Data: ' + pulseSurvey);

    avgePulseScore = 2

    useEffect(() => {
        if (avgePulseScore < 3) {
            const hasShownToast = sessionStorage.getItem('lowMoodToastShown');
            if (!hasShownToast) {
                toast("User mood is below 3");
                sessionStorage.setItem('lowMoodToastShown', 'true');
            }
        }
    }, [avgePulseScore]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }

    if (!mounted) {
        return null;
    }
   
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={theme}
            />
            
            <main className={`transition-all duration-300 ${isPanelOpen ? 'mr-80' : 'mr-0'}`}>
                {project ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700 mx-6">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                                {projectLoading ? (
                                    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-64 rounded"></div>
                                ) : (
                                    project.name
                                )}
                            </h1>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Project ID:</span> {projectId}
                            </p>
                            {project.description && (
                                <p className="text-gray-600 dark:text-gray-400">
                                    <span className="font-medium">Description:</span> {project.description}
                                </p>
                            )}
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Sprints:</span> {sprints?.length || 0}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Team Members:</span> {teamMembers?.length || 0}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700 mx-6">
                        <p className="text-gray-600 dark:text-gray-400">No project data</p>
                    </div>
                )}
            </main>

            <div className="px-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
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
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                    <Charts 
                        velocityMetrics={velocityMetric} 
                        incidents={onCallMatrics} 
                        codeReview={codeReviewMatrics} 
                        users={teamMembers} 
                        sprints={sprints} 
                        pulseSurveys={pulseSurvey}
                        userRole={"manager"}
                    />
                </div>
            </div>

            <div className="px-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Team Performance</h2>
                    <ContributorChart 
                        teamMembers={teamMembers} 
                        onCall={onCallMatrics} 
                        reviewCounts={codeReviewMatrics} 
                        pulseSurvey={pulseSurvey}
                    />
                </div>
            </div>

            <div className="px-6 left-4 flex gap-4 z-40">
                <VelocityUploader project_id={projectId}/>
                <Oncall />
                <CodeReviewUploader />
            </div>

            <Button
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                className={`fixed top-8 right-0 z-50 h-10 w-10 rounded-l-md rounded-r-none bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300 ${
                    isPanelOpen ? 'translate-x-[-320px]' : 'translate-x-0'
                }`}
                size="icon"
                title={isPanelOpen ? "Close Panel" : "Open Panel - Edit Project, Manage Sprints & Team"}
            >
                {isPanelOpen ? (
                    <ChevronRight className="h-5 w-5 text-white" />
                ) : (
                    <Menu className="h-5 w-5 text-white" />
                )}
            </Button>

            <SidePanel
                project={project}
                sprints={sprints}
                members={teamMembers}
                nonTeamMembers={nonTeamMembers}
                isOpen={isPanelOpen}
                onOpenChange={setIsPanelOpen}
            />
        </div>
    );
};

export default Index;