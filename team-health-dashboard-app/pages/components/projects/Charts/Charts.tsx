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
import CodeReviewMetrics from '../KPICards/CodeReviewMetrics';

interface ChartsProps {
 users: User[] 
 sprints: sprints[]
 velocityMetrics: velocityCart[]
 codeReview: codeReview[]
 incidents: incidents[]
 pulseSurveys: pulseChartProps []
}

const Charts: React.FC<ChartsProps> = ({velocityMetrics, incidents, codeReview, users, sprints, pulseSurveys}) => {

   velocityMetrics.forEach(velocity => {
       const sprint = sprints?.find(sprint => sprint.id === velocity.sprint_id);
       if (sprint) {
           const endDate = new Date(sprint.end_date)
           velocity.endDate = endDate.toDateString()
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

   
   
   return (
       <div className="space-y-8">
           <div className="text-center mb-8">
               <h2 className="text-2xl font-bold text-gray-800 mb-2">Analytics Dashboard</h2>
               <p className="text-gray-600">Sprint performance and incident tracking</p>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                   <VelocityChart velocityData={velocityMetrics} />
               </div>
               
               <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                   <IncidentsCharts incidents={incidents} />
               </div>

                 <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                   <PulseChart pulses={pulseSurveys} />
               </div>

               
                 <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                   <SprintChart incidents={incidents} velocitites={velocityMetrics} codeReviews={codeReview} sprints = {sprints}/>
               </div>
           </div>
       </div>
   )
}

export default Charts