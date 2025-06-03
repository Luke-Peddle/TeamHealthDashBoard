import React from 'react'
import MemberDetails from './MemberDetails'
import { User } from '@/types/user'

interface MembersProps {
 members: User[];
}

const Members: React.FC<MembersProps> = ({ members }) => {
 return (
   <div className="space-y-4">
     <h3 className="text-lg font-semibold text-gray-800 mb-3">Team Members</h3>
     {members && members.length > 0 ? (
       <div className="space-y-2">
         {members.map(member => (
           <MemberDetails key={member.user_id} member={member} />
         ))}
       </div>
     ) : (
       <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
         <p className="text-gray-600 text-center text-sm">No team members yet</p>
       </div>
     )}
   </div>
 )
}

export default Members