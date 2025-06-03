import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios';
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';
import { User } from '@/types/user';

interface MemberDetailsProps {
    member: User;
}

const MemberDetails: React.FC<MemberDetailsProps> = ({ member }) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [showConfirm, setShowConfirm] = useState(false);
    const { id } = router.query;

    const deleteMemberMutation = useMutation({
        mutationFn: async () => {
            await axios.delete(`http://localhost:4000/api/users/removeMember/${id}/${member.user_id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teamMembers', id] });
            queryClient.invalidateQueries({ queryKey: ['nonTeamMembers', id] });
            queryClient.invalidateQueries({ queryKey: ['teamMembers', String(id)] });
            queryClient.invalidateQueries({ queryKey: ['nonTeamMembers', String(id)] });
            setShowConfirm(false);
        },
        onError: (error) => {
            console.error('Server-side delete error:', error);
            setShowConfirm(false);
        }
    });

    const handleDeleteClick = () => {
        setShowConfirm(true);
    };

    const handleConfirmDelete = () => {
        deleteMemberMutation.mutate();
    };

    const handleCancelDelete = () => {
        setShowConfirm(false);
    };

    const isDeleting = deleteMemberMutation.isPending;
    
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-3 flex justify-between items-center hover:shadow-sm transition-all duration-200 relative">
            <div className="flex items-center">
                <h3 className="font-medium text-gray-800 text-sm">
                    {member.first_name} {member.last_name}
                </h3>
            </div>
            
            <button 
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="text-xs px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors duration-200 flex items-center disabled:opacity-50 border border-red-200"
            >
                {isDeleting ? (
                    <Loader2 size={12} className="animate-spin" />
                ) : (
                    "Remove"
                )}
            </button>
            
            {showConfirm && (
                <div className="absolute inset-0 bg-white bg-opacity-95 rounded-lg flex items-center justify-center border-2 border-red-200 backdrop-blur-sm">
                    <div className="text-center p-3">
                        <p className="text-xs text-gray-700 mb-3">
                            Remove "{member.first_name} {member.last_name}"?
                        </p>
                        <div className="flex gap-2 justify-center">
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
                            >
                                {isDeleting && <Loader2 size={10} className="animate-spin" />}
                                Remove
                            </button>
                            <button
                                onClick={handleCancelDelete}
                                disabled={isDeleting}
                                className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MemberDetails