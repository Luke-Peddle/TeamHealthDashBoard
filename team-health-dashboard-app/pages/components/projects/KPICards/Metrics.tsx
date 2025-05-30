import React from 'react'
import VelocityKPICard from './VelocityKPICard';
import OnCallKPICard from './OnCallKPICard';
import CodeReviewMetrics from './CodeReviewMetrics';
import { velocity } from '@/types/velocity';
import { onCall } from '@/types/onCall';
import { codeReview } from '@/types/codeReview';

interface MetricsProps {
   velocityMetric: velocity[]
   onCallMetrics: onCall[]
   codeReviewMetrics: codeReview[]
   sprint_id: number
}

const Metrics: React.FC<MetricsProps> = ({ velocityMetric, onCallMetrics, codeReviewMetrics, sprint_id }) => {
   const currentVelocity = velocityMetric?.find(velocity => velocity.sprint_id === sprint_id);
   console.log("Code Review: " + codeReviewMetrics);

   if (!velocityMetric || !onCallMetrics || !codeReviewMetrics) {
       return <div>Loading metrics...</div>;
   }

   const currentOnCall = onCallMetrics?.filter(record => 
        record.sprint_id === sprint_id
   );

   const currentCodeReviews = codeReviewMetrics?.filter(record => 
        record.sprint_id === sprint_id
   );

   console.log("Code: " + codeReviewMetrics.length)

   let incidentsCompleted = 0;

   currentOnCall.forEach(oncall => {
       incidentsCompleted += oncall.incidents_count
   })
   console.log("On Call: " + onCallMetrics[0]);

   let prsReviewed = 0;
   let reviewTime = 0;

   currentCodeReviews?.forEach(codeReview => {
       prsReviewed += codeReview.prs_reviewed
       console.log("res review in metric: " + prsReviewed)
       reviewTime += codeReview.avg_review_time_hours
   })

   return (
       <div className="mt-8">
           <h2 className="text-xl font-semibold text-gray-800 mb-6">Sprint KPIs</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <VelocityKPICard velocity={currentVelocity} />
               <OnCallKPICard 
                   onCallIncidents={incidentsCompleted} 
                   aveCompletedPerPerson={incidentsCompleted/2} 
               />
               <CodeReviewMetrics 
                   prReviewed={prsReviewed} 
                   avgReviewTime={reviewTime/2} 
               />
           </div>
       </div>
   )
}

export default Metrics