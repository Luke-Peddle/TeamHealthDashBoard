import React, {useState} from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Select from 'react-select';
import { useRouter } from 'next/router';

const AddMember = ({members}) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [teamMember, setTeamMember] = useState({});
    const [message, setMessage] = useState({ text: '', type: '' });
    const { id } = router.query;

    const selectOptions = members.map((member) => {
        return {value: member.user_id, label: member.username}
    });

    const addMemberMutation = useMutation({
        mutationFn: async (memberId) => {
            const response = await axios.post(`http://localhost:4000/api/project/addMember/${id}/${memberId}`);
            return response.data;
        },
        onSuccess: (data) => {
            console.log('User added', data);
            setMessage({ text: 'User added successfully!', type: 'success' });
            setTeamMember('');
            
            queryClient.invalidateQueries({ queryKey: ['teamMembers', id] });
            queryClient.invalidateQueries({ queryKey: ['nonTeamMembers', id] });
            queryClient.invalidateQueries({ queryKey: ['teamMembers', String(id)] });
            queryClient.invalidateQueries({ queryKey: ['nonTeamMembers', String(id)] });
            
            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 3000);
        },
        onError: (error) => {
            console.error('There was an error adding the user!', error);
            setMessage({ text: 'Error adding the user', type: 'error' });
            
            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 5000);
        }
    });

    const AddingTeamMember = async () => {
        if (!teamMember.value) return;
        addMemberMutation.mutate(teamMember.value);
    }

    const isLoading = addMemberMutation.isPending;
    
    const customStyles = {
        control: (provided) => ({
            ...provided,
            borderRadius: '0.375rem',
            borderColor: '#e2e8f0',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#cbd5e0',
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : null,
            color: state.isSelected ? 'white' : '#1f2937',
        }),
    };
    
    return (
        <div >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Add Team Member
            </h3>

            <div className="space-y-4">
                <Select 
                    options={selectOptions}
                    onChange={(selectedOption) => {
                        setTeamMember(selectedOption);
                    }}
                    value={teamMember}
                    placeholder="Select a user to add to the team..."
                    styles={customStyles}
                    className="mb-4"
                />
                
                <button 
                    onClick={AddingTeamMember}
                    disabled={!teamMember.value || isLoading}
                    className={`w-full py-2 px-4 rounded-md font-medium text-white transition-colors duration-200 
                    ${!teamMember.value || isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {isLoading ? 'Adding...' : 'Add Member'}
                </button>
                
                {message.text && (
                    <div className={`mt-2 p-2 rounded text-sm ${
                        message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AddMember