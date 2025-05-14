import React, {useState} from 'react';
import axios from 'axios';
import Select from 'react-select'
import { useRouter } from 'next/router';

const AddMember = ({members}) => {
    const router = useRouter();

    const[teamMember, setTeamMember] = useState({})
    const [message, setMessage] = useState({ text: '', type: '' });
    

     const selectOptions = members.map((member) => {
        return {value: member.user_id, label: member.username }
    });
    console.log(selectOptions)

    const AddingTeamMember  = async () => {

        const { id } = router.query;
        console.log(teamMember)
       

            axios.post(`http://localhost:4000/api/project/addMember/${id}/${teamMember.value}`) 

            .then(response => {
            console.log('user addede', response.data);
            setMessage({ text: 'User added successfully!', type: 'success' });
            
            setTeamMember('');
        })
        .catch(error => {
            console.error('There was an error adding the user!', error);
            setMessage({ text: 'Error adding the user', type: 'error' });
        });
       
    }
    
  return (
    <div>
        <h3>
            Add Member
        </h3>

        <Select 
         options={selectOptions}
                onChange={(selectedOption) => {
                    setTeamMember(selectedOption);
                    console.log('Selected:', selectedOption);
                }}
                value={teamMember}
                placeholder="Select a user to add to the team..."
        />
        <button onClick={AddingTeamMember}>Add Member</button>
    </div>
  )
}

export default AddMember