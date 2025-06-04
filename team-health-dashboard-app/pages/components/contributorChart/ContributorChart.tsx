import React from 'react'
import MemberDetails from './memberDetails';

const ContributorChart = ({teamMembers, onCall, reviewCounts,pulseSurvey}) => {

     if (!teamMembers || !onCall || !reviewCounts || !pulseSurvey) {
       return <div className="p-4">Loading metrics...</div>;
   }

    teamMembers.forEach(member => {
        console.log("Pulse survey: " + pulseSurvey)
        const memberOncallAmount = onCall.filter(record =>
            record.user_id === member.user_id
        )

        member.oncallTotal = 0;
        memberOncallAmount.forEach(oncall => {
            member.oncallTotal += oncall.incidents_count
        });
        
        const memberReviewCounts = reviewCounts.filter(record =>
            record.user_id === member.user_id
        )
        member.totalReviews = 0

        memberReviewCounts.forEach(review => {
             member.totalReviews += review.prs_reviewed
        });

        const pulseScore = pulseSurvey.filter(record =>
            record.user_id === member.user_id
        )

        member.pusle = pulseScore[0].score
        console.log("Member: " + JSON.stringify(member))
    });

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Team Contributors</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map((member, index) => {
                    return <MemberDetails key={member.user_id || index} member={member} />;
                })}
            </div>
        </div>
    )
}

export default ContributorChart