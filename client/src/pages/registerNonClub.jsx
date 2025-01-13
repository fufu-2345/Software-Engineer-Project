import React, { useState, useEffect, useReducer } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios';
import Popup from 'reactjs-popup'
import { useRef } from 'react';

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

    const usernameError = useRef()
    const otpSentError = useRef()

    const enterOTP = useRef()
    const [otpPopupStatus, setPopupStatus] = useState(false)
    const [otp , setOTP] = useState('')

    const otpChange = (e) =>{
      setOTP(e.target.value)
    }

    async function submitOTP(){

    }

    const registerError = useRef()
    const registerSuccess = useRef()

    const navigate = useNavigate()

    async function submitData(){

        var api = `http://localhost:5000/checkUsername`
        var body = {"username" : username, "password" : password, "accountName" : name,"email" : email}
        var response = await axios.post(api,body)
        if(response.data == 'Failed'){
          usernameError.current.open
          return
        }

        api = `http://localhost:5000/Sendotp/`
        response = await axios.post(api,body)
        if(response.data.success == false){
          otpSentError.current.open
          return
        }

        setPopupStatus(true)

        api = `http://localhost:5000/registerNonClubMember/`
        response = await axios.post(api,body)
        if(response.data.success == false){
          registerError.current.open
          return
        }
        registerSuccess.current.open
        setTimeout(() => { 
        }, 1000);
        navigate('/Main')
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
      {isPopupOpen && (
            <Popup ref = {enterOTP}>
              <input value={otp} onChange={otpChange}></input>
              <button onClick={submitOTP}>Submit</button>
              <button onClick={closeOTP}>Close</button>
            </Popup>
      )}
      <Popup ref={usernameError}>
        This Username is already in used.
      </Popup>
      <Popup ref={otpSentError}>
        Cannot send OTP to this Email, Please try again later
      </Popup>
      <Popup ref={registerError}>
        Cannot register, Please try again later
      </Popup>
      <Popup ref={registerSuccess}>
        Register Success
      </Popup>
        </>
    );
    
}

export default RegisterNonClub;