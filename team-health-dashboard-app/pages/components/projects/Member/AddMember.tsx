import React, {useState} from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Select from 'react-select';
import { useRouter } from 'next/router';
import { User } from '@/types/user';

interface AddMemberProps {
   members: User[]
}

interface SelectOption {
   value: number;
   label: string;
}

const AddMember: React.FC<AddMemberProps> = ({members}) => {
   const router = useRouter();
   const queryClient = useQueryClient();
   const [teamMember, setTeamMember] = useState<SelectOption | null>(null);
   const [message, setMessage] = useState({ text: '', type: '' });
   const { id } = router.query;

   const selectOptions: SelectOption[] = members.map((member) => {
       return {value: member.user_id, label: member.username}
   });

   const addMemberMutation = useMutation<any, Error, number>({
       mutationFn: async (memberId: number) => {
           const response = await axios.post(`http://localhost:4000/api/project/addMember/${id}/${memberId}`);
           return response.data;
       },
       onSuccess: (data) => {
           console.log('User added', data);
           setMessage({ text: 'User added successfully!', type: 'success' });
           setTeamMember(null);
           
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
       if (!teamMember?.value) return;
       addMemberMutation.mutate(teamMember.value);
   }

   const isLoading = addMemberMutation.isPending;
   
   const customStyles = {
       control: (provided: any, state: any) => ({
           ...provided,
           borderRadius: '0.375rem',
           borderColor: state.theme === 'dark' ? '#4b5563' : '#d1d5db',
           backgroundColor: state.theme === 'dark' ? '#374151' : '#ffffff',
           boxShadow: 'none',
           fontSize: '14px',
           minHeight: '38px',
           '&:hover': {
               borderColor: state.theme === 'dark' ? '#6b7280' : '#9ca3af',
           },
       }),
       menu: (provided: any, state: any) => ({
           ...provided,
           backgroundColor: state.theme === 'dark' ? '#374151' : '#ffffff',
           border: state.theme === 'dark' ? '1px solid #4b5563' : '1px solid #d1d5db',
       }),
       option: (provided: any, state: any) => ({
           ...provided,
           backgroundColor: state.isSelected 
               ? (state.theme === 'dark' ? '#3b82f6' : '#3b82f6') 
               : state.isFocused 
               ? (state.theme === 'dark' ? '#4b5563' : '#eff6ff') 
               : (state.theme === 'dark' ? '#374151' : '#ffffff'),
           color: state.isSelected 
               ? 'white' 
               : (state.theme === 'dark' ? '#f9fafb' : '#1f2937'),
           fontSize: '14px',
       }),
       singleValue: (provided: any, state: any) => ({
           ...provided,
           color: state.theme === 'dark' ? '#f9fafb' : '#1f2937',
       }),
   };
   
   return (
       <div>
           <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
               Add Team Member
           </h3>

           <div className="space-y-4">
               <Select 
                   options={selectOptions}
                   onChange={(selectedOption) => {
                       setTeamMember(selectedOption);
                   }}
                   value={teamMember}
                   placeholder="Select a user to add..."
                   styles={customStyles}
                   className="text-sm"
                   theme={(theme) => ({
                       ...theme,
                       colors: {
                           ...theme.colors,
                           primary: '#3b82f6',
                           primary25: '#eff6ff',
                           primary50: '#dbeafe',
                           primary75: '#93c5fd',
                       },
                   })}
               />
               
               <button 
                   onClick={AddingTeamMember}
                   disabled={!teamMember?.value || isLoading}
                   className={`w-full py-2 px-4 rounded-md font-medium text-white text-sm transition-colors duration-200 
                   ${!teamMember?.value || isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800'} 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
               >
                   {isLoading ? (
                       <div className="flex items-center justify-center">
                           <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           Adding...
                       </div>
                   ) : 'Add Member'}
               </button>
               
               {message.text && (
                   <div className={`p-3 rounded-md text-sm border ${
                       message.type === 'success' 
                           ? 'bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700' 
                           : 'bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700'
                   }`}>
                       <div className="flex items-center">
                           {message.text}
                       </div>
                   </div>
               )}
           </div>
       </div>
   )
}

export default AddMember