import React, { useEffect } from 'react'
import { useState } from 'react';
import Metrics from '@/pages/components/projects/KPICards/Metrics';
import Charts from '@/pages/components/projects/Charts/Charts';
import SidePanel from '@/pages/components/projects/SidePannel/SidePanel';
import { Button } from '@/components/ui/button';
import { Menu, ChevronRight } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';

const ContributorPage = ({ project, 
    sprints, 
    teamMembers, 
    nonTeamMembers, 
    projectId, 
    velocityMetric, 
    onCallMatrics, 
    codeReviewMatrics, 
    pulseSurvey, 
    darkMode, 
    role, 
    userId }) => {

    const [isPanelOpen, setIsPanelOpen] = useState(false);

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
        
  return (
    <div className="p-6">
           
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
                        userRole={role}
                    />
                </div>
            </div>

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

            <SidePanel
                project={project}
                sprints={sprints}
                members={teamMembers}
                nonTeamMembers={nonTeamMembers}
                isOpen={isPanelOpen}
                darkMode={darkMode}
                user_id={userId}
                role={role}
                onOpenChange={setIsPanelOpen}
            />
        </div>
  )
}

export default ContributorPage