import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Metrics from '@/pages/components/projects/KPICards/Metrics';
import Charts from '@/pages/components/projects/Charts/Charts';
import SidePanel from '@/pages/components/projects/SidePannel/SidePanel';
import jwt from 'jsonwebtoken';
import { Button } from '@/components/ui/button';
import { Menu, ChevronRight } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import ManagerPage from '../../manager/projects/ManagerPage';
import ContributorPage from '../../manager/projects/ContributorPage';

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
 const token = context.req.cookies.token || 
                  context.req.cookies.refreshToken;
    
    if (!token) {
        console.log('No token found in cookies');
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
        }
            try {
        const decoded = jwt.verify(token, 'f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd1');
        const { userId, role, darkMode } = decoded;


        if (role === 'admin') {
            return {
                redirect: {
                    destination: '/admin',
                    permanent: false,
                },
            };
        }


        

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

        console.log("pulse Surveys data: " + pulseResponse.data);

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
                darkMode,
                userId,
                role,
                pulseSurvey
            }
        };
    } catch (error) {
        console.error('Server-side fetch error:', error);
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }
}

const ProjectPageContent = ({ 
    project: initialProject, 
    sprints: initialSprints, 
    teamMembers: initialTeamMembers, 
    nonTeamMembers: initialNonTeamMembers, 
    projectId, 
    velocityMetric: initialVelocityMetric, 
    onCallMatrics: initialOnCallMetric, 
    codeReview: initalCodeReview, 
    pulseSurvey: initialPulseSurvey, 
    darkMode, 
    role, 
    userId 
}) => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);

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

    if (!currentSprint && sprints.length > 0) {
        currentSprint = sprints[0]
    }

    const renderDashBoard = () => {
        if(role === 'manager'){
            return <ManagerPage project = {project}
                  sprints = {sprints} teamMembers={teamMembers} 
                  nonTeamMembers={nonTeamMembers}
                  projectId={projectId}
                  velocityMetric={velocityMetric}
                  onCallMatrics={onCallMatrics}
                  codeReviewMatrics={codeReviewMatrics}
                  pulseSurvey={pulseSurvey}
                  darkMode={darkMode}
                  userId={userId}
                  role={role} />
        }

        else{
            return <ContributorPage project = {project}
                  sprints = {sprints} teamMembers={teamMembers} 
                  nonTeamMembers={nonTeamMembers}
                  projectId={projectId}
                  velocityMetric={velocityMetric}
                  onCallMatrics={onCallMatrics}
                  codeReviewMatrics={codeReviewMatrics}
                  pulseSurvey={pulseSurvey}
                  darkMode={darkMode}
                  userId={userId}
                  role={role} />
        }
    }

    return (
        <div className="p-6">
           {renderDashBoard()}

           <Button
                           onClick={() => setIsPanelOpen(!isPanelOpen)}
                           className={`fixed top-8 right-0 z-50 h-10 w-10 rounded-l-md rounded-r-none bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-300 ${isPanelOpen ? 'translate-x-[-320px]' : 'translate-x-0'
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
                       <LogOutSidePanel   isOpen={isPanelOpen} user_id={userId} onOpenChange ={setIsPanelOpen} />

        </div>
    )
}

const Index = (props) => {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated()) {
            router.push('/login');
        }
    }, [loading, isAuthenticated, router]);

    if (loading || !user) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated()) {
        return null;
    }

    return <ProjectPageContent {...props} />;
};

export default Index;