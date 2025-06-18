import React from 'react'
import VelocityChart from './VelocityChart';
import IncidentsCharts from './IncidentsCharts';
import { velocityCart } from '@/types/velocity';
import { incidents } from '@/types/onCall';
import { codeReview } from '@/types/codeReview';
import { pulseChartProps } from '@/types/PulseChart';
import { sprints } from '@/types/sprints';
import { User } from '@/types/user';
import PulseChart from './PulseChart';
import SprintChart from './SprintChart';
import ContributorIncidentChart from './contributor/ContributorIncidentChart';
import ContribuorPulseChart from './contributor/ContribuorPulseChart';
import CodeReviewMetrics from '../KPICards/CodeReviewMetrics';

interface ChartsProps {
 users: User[] 
 sprints: sprints[]
 velocityMetrics: velocityCart[]
 codeReview: codeReview[]
 incidents: incidents[]
 pulseSurveys: pulseChartProps []
 userRole: string
}

const Charts: React.FC<ChartsProps> = ({velocityMetrics, incidents, codeReview, users, sprints, pulseSurveys,userRole}) => {

   velocityMetrics.forEach(velocity => {
       const sprint = sprints?.find(sprint => sprint.id === velocity.sprint_id);
       if (sprint) {
           const endDate = new Date(sprint.end_date)
           velocity.endDate = endDate.toDateString()
           velocity.sprintName = sprint.name
       }
   })
   
   incidents.forEach((incident) => {
       const user = users?.find(user => user.user_id === incident.user_id)
       if (user) {
           incident.username = `${user.first_name} ${user.last_name}`
       }
       const date = new Date(incident.week_starting_date)
       incident.week_starting_date = date.toDateString();
   })

   pulseSurveys.forEach((pulse) =>{
    const user = users?.find(user => user.user_id === pulse.user_id);

    if (user) {
           pulse.username = `${user.first_name} ${user.last_name}`
       }
   })

    const renderIncidentChart = () => {
       if (userRole === 'manager') {
           return <IncidentsCharts incidents={incidents} />;
       } else {
           return <ContributorIncidentChart incidents={incidents} />;
       }
   };

   const renderPulseChart = () => {
       if (userRole === 'manager') {
           return <PulseChart pulses={pulseSurveys} />;
       } else {
           return <ContribuorPulseChart pulses={pulseSurveys} />;
       }
   };
   
   return (
       <div className="space-y-8">
           <div className="text-center mb-8">
               <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-200">
                   Analytics Dashboard
               </h2>
               <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
                   Sprint performance and incident tracking
               </p>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm dark:shadow-md transition-all duration-200">
                   <VelocityChart velocityData={velocityMetrics} />
               </div>
               
               <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm dark:shadow-md transition-all duration-200">
                   {renderIncidentChart()}
               </div>

               <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm dark:shadow-md transition-all duration-200">
                   {renderPulseChart()}
               </div>

               <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm dark:shadow-md transition-all duration-200">
                   <SprintChart incidents={incidents} velocitites={velocityMetrics} codeReviews={codeReview} sprints = {sprints}/>
               </div>
           </div>
       </div>
   )
}

export default Charts