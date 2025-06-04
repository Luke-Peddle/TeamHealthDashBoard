import React from 'react'

const MemberDetails = ({member}) => {
    if (!member) {
        return <div>No member data</div>;
    }
    
    return (
        <div className="border p-4 m-2 bg-white rounded">
            <div className="font-bold text-lg">
                {member.first_name || 'No first name'} {member.last_name || 'No last name'}
            </div>
            <div className="mt-2">
                <div>On-call: {member.oncallTotal || 0}</div>
                <div>Reviews: {member.totalReviews || 0}</div>
            </div>
        </div>
    )
}

export default MemberDetails