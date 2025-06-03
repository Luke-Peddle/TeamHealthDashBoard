import React from 'react'
import MemberDetails from './MemberDetails'

const Members = ({members}) => {
  return (
    <div className="space-y-3 mt-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Team Members</h3>
        {members && members.length > 0 ? (
            <div className="space-y-2">
                {members.map(member => (
                    <MemberDetails key={member.user_id} member={member} />
                ))}
            </div>
        ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 text-center">No Members yet</p>
            </div>
        )}
    </div>
  )
}

export default Members