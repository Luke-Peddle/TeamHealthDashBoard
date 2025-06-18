import React from 'react'
import { MemberChart } from '@/types/user';

interface MemberChartProps {
    member: MemberChart
}

const MemberDetails: React.FC<MemberChartProps> = ({ member }) => {
    console.log("Member: " + JSON.stringify(member))

    if (!member) {
        return <div className="text-gray-900 dark:text-gray-100">No member data available</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">{member.first_name} {member.last_name}</h2>
            <table className="w-full border border-gray-200 dark:border-gray-700">
                <tbody className="bg-white dark:bg-gray-900">
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="p-3 font-medium bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">Name</td>
                        <td className="p-3 text-gray-900 dark:text-gray-100">{member.first_name} {member.last_name}</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="p-3 font-medium bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">On-Call</td>
                        <td className="p-3 text-gray-900 dark:text-gray-100">{member.oncallTotal || 0}</td>
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="p-3 font-medium bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">Reviews</td>
                        <td className="p-3 text-gray-900 dark:text-gray-100">{member.totalReviews || 0}</td>
                    </tr>
                    <tr>
                        <td className="p-3 font-medium bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">Recent Pulse Score</td>
                        <td className="p-3 text-gray-900 dark:text-gray-100">{member.pulse || 'N/A'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default MemberDetails