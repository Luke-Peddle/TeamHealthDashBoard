import React from 'react'
import { MemberChart } from '@/types/user';

interface MemberChartProps {
    member: MemberChart
}

const MemberDetails: React.FC<MemberChartProps> = ({ member }) => {
    console.log("Member: " + JSON.stringify(member))

    if (!member) {
        return <div>No member data available</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-lg font-bold mb-4">{member.first_name} {member.last_name}</h2>
            <table className="w-full border">
                <tbody>
                    <tr className="border-b">
                        <td className="p-3 font-medium bg-gray-50">Name</td>
                        <td className="p-3">{member.first_name} {member.last_name}</td>
                    </tr>
                    <tr className="border-b">
                        <td className="p-3 font-medium bg-gray-50">On-Call</td>
                        <td className="p-3">{member.oncallTotal || 0}</td>
                    </tr>
                    <tr className="border-b">
                        <td className="p-3 font-medium bg-gray-50">Reviews</td>
                        <td className="p-3">{member.totalReviews || 0}</td>
                    </tr>
                    <tr>
                        <td className="p-3 font-medium bg-gray-50">Recent Pulse Score</td>
                        <td className="p-3">{member.pulse || 'N/A'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default MemberDetails