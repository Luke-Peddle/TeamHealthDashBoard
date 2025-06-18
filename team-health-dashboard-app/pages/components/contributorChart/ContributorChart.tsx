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
                <div className="text-center text-gray-500 dark:text-gray-400">Loading metrics...</div>
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
            <h1 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Team Contributors</h1>
            <table className="w-full border border-gray-200 dark:border-gray-700">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <th className="p-3 text-left font-medium text-gray-900 dark:text-gray-100">Name</th>
                        <th className="p-3 text-left font-medium text-gray-900 dark:text-gray-100">On-Call</th>
                        <th className="p-3 text-left font-medium text-gray-900 dark:text-gray-100">Reviews</th>
                        <th className="p-3 text-left font-medium text-gray-900 dark:text-gray-100">Recent Pulse Score</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900">
                    {teamMembers.map((member, index) => (
                        <tr key={member.user_id || index} className="border-b border-gray-200 dark:border-gray-700">
                            <td className="p-3 text-gray-900 dark:text-gray-100">{member.first_name} {member.last_name}</td>
                            <td className="p-3 text-gray-900 dark:text-gray-100">{member.oncallTotal || 0}</td>
                            <td className="p-3 text-gray-900 dark:text-gray-100">{member.totalReviews || 0}</td>
                            <td className="p-3 text-gray-900 dark:text-gray-100">{member.pulse}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ContributorTable