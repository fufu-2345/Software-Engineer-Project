import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RegisterNonClub = () => {
    var [username,setUserName] = useState('')
    var [password,setPassword] = useState('')
    var [email,setEmail] = useState('')
    var [name,setName] = useState('')
      
    const usernameChange = (e) =>{
      setUserName(e.target.value)
    }
    const passwordChange = (e) =>{
      setPassword(e.target.value)
    }
    const emailChange = (e) =>{
      setEmail(e.target.value)
    }
    const nameChange = (e) =>{
        setName(e.target.value)
    }

    function submitData(){
        var api = `http://localhost:5000/registerNonClubMember/`
        var body = {"username" : username, "password" : password, "accountName" : name}
        axios.post(api,body)
        .then(response =>{
            console.log(body)
            console.log(response)
        })
    }

    return (
        <>
            
      Username
      <input value={username} onChange={usernameChange}></input>
      <br></br>
      PWD
      <input value={password} onChange={passwordChange}></input>
      <br></br>
      EMail
      <input value={email} onChange={emailChange}></input>
      <br></br>
      Name
      <input value={name} onChange={nameChange}></input>
      <br></br>
      <button onClick={submitData}> Tset</button>
        </>
    );
    
}

export default RegisterNonClub;