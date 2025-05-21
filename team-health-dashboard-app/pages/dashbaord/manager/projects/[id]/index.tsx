import React, { useState } from 'react';
import axios from 'axios';
import SidePanel from '@/pages/components/projects/SidePannel/SidePAnnel';
import EditProject from '@/pages/components/projects/EditProject';
import VelocityUploader from '@/pages/components/Uploader/velocityUploader';
import { Button } from '@/components/ui/button';
import { Menu, ChevronRight } from 'lucide-react';

export async function getServerSideProps(context) {
    const { id } = context.params;
    console.log(id)
    
  
    try {
        const projectResponse = await axios.get(`http://localhost:4000/api/project/${id}`);
        const sprintResponse = await axios.get(`http://localhost:4000/api/sprint/project/${id}`);
        const teamMembersResponse = await axios.get(`http://localhost:4000/api/users/teamMembers/${id}`);
        const nonTeamMembersResponse = await axios.get(`http://localhost:4000/api/users/nonTeamMembers/${id}`);


        const project = projectResponse.data;
        const sprints = sprintResponse.data;
        const teamMembers = teamMembersResponse.data
        const nonTeamMembers = nonTeamMembersResponse.data
        console.log("Project: "+ project)
        return { props: { project, sprints, teamMembers, nonTeamMembers } };
    } catch (error) {
        console.error('Server-side fetch error:', error);
        return { props: { project: {}, sprints: [], teamMembers: [] } };
    }
}

const Index = ({ project, sprints, teamMembers, nonTeamMembers }) => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 py-8">

            <main className={`transition-all duration-300 ${isPanelOpen ? 'mr-80' : 'mr-0'}`}>
                {project ? (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{project.name}</h1>
                        <p className="text-gray-600">Project ID: {project.id}</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <p className="text-gray-600">No project data</p>
                    </div>
                )}
                </main>
                <div>
                  <VelocityUploader />
                </div>

                <Button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className={`fixed top-8 right-0 z-50 h-10 w-10 rounded-l-md rounded-r-none bg-blue-600 hover:bg-blue-700 transition-all duration-300 ${
          isPanelOpen ? 'translate-x-[-320px]' : 'translate-x-0'
        }`}
        size="icon"
      >
        {isPanelOpen ? (
          <ChevronRight className="h-5 w-5 text-white" />
        ) : (
          <Menu className="h-5 w-5 text-white" />
        )}
      </Button>

      <SidePanel
        project ={project}
        sprints = {sprints}
        members ={teamMembers}
        nonTeamMembers ={nonTeamMembers}
        isOpen={isPanelOpen}
        onOpenChange={setIsPanelOpen}
      />
                
                
            
        </div>
    )
}

export default Index