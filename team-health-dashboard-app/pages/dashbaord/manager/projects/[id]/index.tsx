import React, { useState } from 'react';
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
        const codeReviewMetricResponse = await axios.get(`http://localhost:4000/api/codeReview/${id}`)
        

        const project = projectResponse.data;
        const sprints = sprintResponse.data;
        const teamMembers = teamMembersResponse.data;
        const nonTeamMembers = nonTeamMembersResponse.data;
        const velocityMetric = velocityMetricResponse.data;
        const onCallMatrics = onCallMetricsResponse.data;
        const codeReviewMatrics = codeReviewMetricResponse.data;
        
        console.log("Project: " + project);
        
        return { 
            props: { 
                project, 
                sprints, 
                teamMembers, 
                nonTeamMembers,
                projectId: id,
                velocityMetric,
                onCallMatrics,
                codeReviewMatrics
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
                codeReviewMatrics: []
            } 
        };
    }
}

const Index = ({ project: initialProject, sprints: initialSprints, teamMembers: initialTeamMembers, nonTeamMembers: initialNonTeamMembers, projectId, velocityMetric: initialVelocityMetric, onCallMatrics: initialOnCallMetric, codeReview: initalCodeReview }) => {
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
        queryKey: ['codeReviewMatrics', projectId],
        queryFn: () => fetchCodeReview(projectId),
        initialData: initalCodeReview,
        staleTime: 5 * 60 * 1000, 
    })

    

   
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <main className={`transition-all duration-300 ${isPanelOpen ? 'mr-80' : 'mr-0'}`}>
                {project ? (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-3xl font-bold text-gray-800">
                                {projectLoading ? (
                                    <div className="animate-pulse bg-gray-200 h-8 w-64 rounded"></div>
                                ) : (
                                    project.name
                                )}
                            </h1>
                           
                        </div>
                        
                        <div className="mt-4 space-y-2">
                            <p className="text-gray-600">
                                <span className="font-medium">Project ID:</span> {projectId}
                            </p>
                            {project.description && (
                                <p className="text-gray-600">
                                    <span className="font-medium">Description:</span> {project.description}
                                </p>
                            )}
                            <p className="text-gray-600">
                                <span className="font-medium">Sprints:</span> {sprints?.length || 0}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-medium">Team Members:</span> {teamMembers?.length || 0}
                            </p>
                        </div>

        
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <p className="text-gray-600">No project data</p>
                    </div>
                )}
            </main>

            
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 w-full max-w-6xl">
                    <Metrics 
                        velocityMetric={velocityMetric} 
                        onCallMetrics={onCallMatrics} 
                        codeReviewMetrics={codeReviewMatrics} 
                        sprint_id={sprints[0].id} 
                    />
                </div>
                
            </div>
            <Charts velocityMetrics={velocityMetric} incidents={onCallMatrics} users={teamMembers} sprints = {sprints} />
            
            <div className=" left-4 flex gap-4 z-40">
                <VelocityUploader project_id ={projectId}/>
                <Oncall />
                <CodeReviewUploader />
            </div>

            <Button
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                className={`fixed top-8 right-0 z-50 h-10 w-10 rounded-l-md rounded-r-none bg-blue-600 hover:bg-blue-700 transition-all duration-300 ${
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