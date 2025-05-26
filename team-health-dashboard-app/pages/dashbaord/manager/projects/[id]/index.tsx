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

// API functions for TanStack Query
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

export async function getServerSideProps(context) {
    const { id } = context.params;
    console.log(id);
    
    try {
        const projectResponse = await axios.get(`http://localhost:4000/api/project/${id}`);
        const sprintResponse = await axios.get(`http://localhost:4000/api/sprint/project/${id}`);
        const teamMembersResponse = await axios.get(`http://localhost:4000/api/users/teamMembers/${id}`);
        const nonTeamMembersResponse = await axios.get(`http://localhost:4000/api/users/nonTeamMembers/${id}`);

        const project = projectResponse.data;
        const sprints = sprintResponse.data;
        const teamMembers = teamMembersResponse.data;
        const nonTeamMembers = nonTeamMembersResponse.data;
        
        console.log("Project: " + project);
        
        return { 
            props: { 
                project, 
                sprints, 
                teamMembers, 
                nonTeamMembers,
                projectId: id 
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
                projectId: id
            } 
        };
    }
}

const Index = ({ project: initialProject, sprints: initialSprints, teamMembers: initialTeamMembers, nonTeamMembers: initialNonTeamMembers, projectId }) => {
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
{/* 
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Team Health Dashboard</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Current Velocity</h3>
                                    <p className="text-2xl font-bold text-gray-400">--/--</p>
                                    <p className="text-xs text-gray-400 mt-1">Coming soon</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Incident Load</h3>
                                    <p className="text-2xl font-bold text-gray-400">--</p>
                                    <p className="text-xs text-gray-400 mt-1">Coming soon</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Review Efficiency</h3>
                                    <p className="text-2xl font-bold text-gray-400">-- hrs</p>
                                    <p className="text-xs text-gray-400 mt-1">Coming soon</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Team Morale</h3>
                                    <p className="text-2xl font-bold text-gray-400">-.-/5</p>
                                    <p className="text-xs text-gray-400 mt-1">Coming soon</p>
                                </div>
                            </div> */}
                        {/* </div> */}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <p className="text-gray-600">No project data</p>
                    </div>
                )}
            </main>
            
            <div className="fixed bottom-4 left-4 flex gap-4 z-40">
                <VelocityUploader />
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