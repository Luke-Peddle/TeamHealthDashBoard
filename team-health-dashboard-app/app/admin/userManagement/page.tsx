"use client"
import React, {useState} from 'react';
import axios from "axios";


const page = () => {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
   
console.log(userName)
    const handleSubmit =()=>{
        const newUser ={
            username:userName,
            password: password,
            firstName:firstName,
            lastName:lastName,
            email:email,
            role:role
        }
        console.log(newUser)

        axios.post("http://localhost:4000/api/users", newUser) 
        .then(response => {
            console.log('user created successfully:', response.data);

           
        })

        .catch(error => {
            console.error('There was an error creating the user!', error);
        });
    }
  return (
    <div
    className=' grid place-items-center'>
        <h3>Create a New User</h3>
        <div >
        <form onSubmit={handleSubmit}>
            <div>
                
                <label>Username</label>
                <br/>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    className= "border "
                />
            </div>
            <br/>

            <div>
                <label>Password</label>
                <br/>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className= "border "
                />
            </div>
            <br/>

            <div>
                <label>First Name</label>
                <br/>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className= "border "
                />

            </div>
            <br/>

            <div>
                <label>Last Name</label>
                <br/>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className= "border "
                />
            </div>
            <br/>

            <div>
                <label>Email</label>
                <br/>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className= "border "
                />
            </div>
            <br/>

            <div>
                <label>Role</label>
                <br/>
                <input
                    type="radio"
                    id = "Manager"
                    name = 'role'
                    value={'manager'}
                    onChange={(e) => setRole(e.target.value)}
                    required
                />
                <label htmlFor  = "Manager">manager</label><br></br>

                <input
                    type="radio"
                    id = "Admin"
                    name = 'role'
                    value={'admin'}
                    onChange={(e) => setRole(e.target.value)}
                    required
                />
                <label htmlFor  = "Admin">admin</label><br></br>
           

            <input
                    type="radio"
                    id = "contributor"
                    name = 'role'
                    value={"contributor"}
                    onChange={(e) => setRole(e.target.value)}
                    required
                />
                <label htmlFor  = "contributor">contributor</label><br></br>
                <br/>
                
            </div>

            <button type="submit" className='border'>Add User</button>
        </form>
        </div>
        </div>
  )
}

export default page