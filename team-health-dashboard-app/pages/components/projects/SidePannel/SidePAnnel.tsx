import React from 'react'
import { Separator } from '@/components/ui/separator';
import Sprint from '../sprint/Sprint';
import Members from '../Member/MembersList';
import AddMember from '../Member/AddMember';
import AddSprint from '../sprint/AddSprint';
import EditProject from '@/pages/components/projects/EditProject';
import DarkModeButton from '@/pages/components/DarkModeButton/DarkModeButton';
import { useTheme } from 'next-themes';
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
        const { theme, setTheme } = useTheme();
        
        const toggleTheme = () => {
            setTheme(theme === 'dark' ? 'light' : 'dark');
        };
        
        console.log(members)
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-80 sm:max-w-sm overflow-y-auto fixed top-0 right-0 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700"
      >
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">Project Management</SheetTitle>
            <DarkModeButton 
              isDark={theme === 'dark'} 
              onToggle={toggleTheme} 
            />
          </div>
        </SheetHeader>

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
      </SheetContent>
    </Sheet>
  )
}

export default SidePanel