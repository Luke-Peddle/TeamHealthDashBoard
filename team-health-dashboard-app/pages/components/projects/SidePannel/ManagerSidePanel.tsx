import React from 'react'
import { Separator } from '@/components/ui/separator';
import Sprint from '../sprint/Sprint';
import Members from '../Member/MembersList';
import AddMember from '../Member/AddMember';
import AddSprint from '../sprint/AddSprint';
import EditProject from '@/pages/components/projects/EditProject';
import { Projects } from '@/types/project';
import { sprints } from '@/types/sprints';
import { User } from '@/types/user';

interface ManagerSidePanelProps {  
  project: Projects
  sprints: sprints[]
  members: User[]
  nonTeamMembers: User[]
  darkMode: boolean
  user_id: number
}

const ManagerSidePanel: React.FC<ManagerSidePanelProps> = ({
    project,
    sprints,
    members,
    nonTeamMembers,
    darkMode,
    user_id,
}) => {
    console.log('ManagerSidePanel rendered with:', { project, sprints, members }); // Debug log
    
    return (
        <div className="space-y-6">
            <EditProject project={project} />
            
            <Separator className="bg-gray-200 dark:bg-gray-700" />
            
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Sprints</h2>
            <div className="space-y-3">
                {sprints && sprints.length > 0 ? (
                    sprints.map(sprint => (
                        <Sprint key={sprint.id} sprint={sprint} project_id={project.id} />
                    ))
                ) : (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <p className="text-gray-600 dark:text-gray-400 text-center text-sm">No sprints yet</p>
                    </div>
                )}
            </div>
            
            <AddSprint sprints={sprints}/>
            
            <Separator className="bg-gray-200 dark:bg-gray-700" />
            
            <AddMember members={nonTeamMembers} />
            <Members members={members} />
        </div>

        
    )
}

export default ManagerSidePanel