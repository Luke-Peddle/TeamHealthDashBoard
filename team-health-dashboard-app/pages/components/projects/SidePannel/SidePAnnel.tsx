import React from 'react'
import { Separator } from '@/components/ui/separator';
import Sprint from '../sprint/Sprint';
import Members from '../Member/MembersList';
import AddMember from '../Member/AddMember';
import AddSprint from '../sprint/addSprint';
import EditProject from '@/pages/components/projects/EditProject';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';


const SidePanel = ({
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
        <EditProject project = {project} />
        <SheetHeader>
          <SheetTitle>Sprint & Team Management</SheetTitle>
        </SheetHeader>

        <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sprints</h2>
                        <div className="space-y-4">
                            {sprints && sprints.length > 0 ? (
                                sprints.map(sprint => (
                                    <Sprint key={sprint.id} sprint={sprint} />
                                ))
                            ) : (
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <p className="text-gray-600 text-center">No sprints yet</p>
                                </div>
                            )}
                            <AddSprint />
                        </div>
                    </div>

                   
                    
                </div>
        
        
          
          <Separator />
          <div>
            <AddMember members ={nonTeamMembers} />
            <br />
            <Members members ={members} />
          </div>
          
         
      </SheetContent>
    </Sheet>
  )
}

export default SidePanel