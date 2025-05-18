import React from 'react'
import MemberDetails from './MemberDetails'

const Members = ({members}) => {
  return (
    <div>
        {members && members.length > 0 ? (
            members.map(member => (
                <MemberDetails member = {member} />
            ))
        ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 text-center">No Members yet</p>
            </div>
        )}
    </div>
  )
}

export default Members