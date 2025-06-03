import React from 'react'
import { Separator } from '@/components/ui/separator';
import Sprint from '../sprint/Sprint';
import Members from '../Member/MembersList';
import AddMember from '../Member/AddMember';
import AddSprint from '../sprint/AddSprint';
import EditProject from '@/pages/components/projects/EditProject';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Projects } from '@/types/project';
import { sprints } from '@/types/sprints';
import { User } from '@/types/user';

interface SidePanel{
  project: Projects
  sprints: sprints []
  members: User[]
  nonTeamMembers: User[]
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const SidePanel: React.FC<SidePanel> = ({
    project,
    sprints,
    members,
    nonTeamMembers,
    isOpen = false,
    onOpenChange}) => {
        console.log(members)
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-80 sm:max-w-sm overflow-y-auto fixed top-0 right-0 h-full"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-bold text-gray-800">Project Management</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          
            <EditProject project={project} />
         

          <Separator />

          
            <h2 className="text-lg font-semibold text-gray-800">Sprints</h2>
            <div className="space-y-3">
              {sprints && sprints.length > 0 ? (
                sprints.map(sprint => (
                  <Sprint key={sprint.id} sprint={sprint} project_id={project.id} />
                ))
              ) : (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <p className="text-gray-600 text-center text-sm">No sprints yet</p>
                </div>
              )}
            </div>
          

          
            <AddSprint />
          
          <Separator />
          
          
           
              <AddMember members={nonTeamMembers} />
           
            <Members members={members} />
         
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default SidePanel