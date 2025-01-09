import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RegisterClub = () => {
    var [username,setUserName] = useState('')
    var [password,setPassword] = useState('')
    var [email,setEmail] = useState('')
    var [name,setName] = useState('')
    var [studentID,setStudentID] = useState('')
  
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
    const studentIDChange = (e) =>{
      setStudentID(e.target.value)
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
      ID
      <input value={studentID} onChange={studentIDChange}></input>
      <br></br>
      
        </>
    );
    
}

export default RegisterClub;