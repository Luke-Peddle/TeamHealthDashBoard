import React from 'react'
import { MemberChart } from '@/types/user';

interface MemberChartProps{
    member: MemberChart
}
const MemberDetails: React.FC<MemberChartProps> = ({member}) => {

    console.log("Member: " + JSON.stringify(member))

    if (!member) {
        return <div>No member data</div>;
    }

    
    return (
        <div className="border p-4 m-2 bg-white rounded">
            <div className="font-bold text-lg">
                {member.first_name} {member.last_name}
            </div>
            <div className="mt-2">
                <div>On-call: {member.oncallTotal || 0}</div>
                <div>Reviews: {member.totalReviews || 0}</div>
                <div>Recent Pulse Score: {member.pulse }</div>

                
            </div>
        </div>
    )
}

export default MemberDetails