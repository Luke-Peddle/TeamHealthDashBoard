import React from 'react'
import { MemberChart } from '@/types/user';
import { onCall } from '@/types/onCall';
import { codeReview } from '@/types/codeReview';
import { pulse } from '@/types/Pulse';

interface ContributorTableProps {
    teamMembers: MemberChart[]
    onCall: onCall[]
    reviewCounts: codeReview[]
    pulseSurvey: pulse[]
}

const ContributorTable: React.FC<ContributorTableProps> = ({ teamMembers, onCall, reviewCounts, pulseSurvey }) => {

    if (!teamMembers || !onCall || !reviewCounts || !pulseSurvey) {
        return (
            <div className="p-4">
                <div className="text-center text-gray-500">Loading metrics...</div>
            </div>
        );
    }

    teamMembers.forEach(member => {
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

        member.pulse = pulseScore[0]?.score 
    });

    return (
        <div className="p-4">
            <h1 className="text-lg font-bold mb-4">Team Contributors</h1>
            <table className="w-full border">
                <thead>
                    <tr className="border-b bg-gray-50">
                        <th className="p-3 text-left font-medium">Name</th>
                        <th className="p-3 text-left font-medium">On-Call</th>
                        <th className="p-3 text-left font-medium">Reviews</th>
                        <th className="p-3 text-left font-medium">Recent Pulse Score</th>
                    </tr>
                </thead>
                <tbody>
                    {teamMembers.map((member, index) => (
                        <tr key={member.user_id || index} className="border-b">
                            <td className="p-3">{member.first_name} {member.last_name}</td>
                            <td className="p-3">{member.oncallTotal || 0}</td>
                            <td className="p-3">{member.totalReviews || 0}</td>
                            <td className="p-3">{member.pulse}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ContributorTable