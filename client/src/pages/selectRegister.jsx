import React, { useState, useEffect, useReducer } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Popup from "reactjs-popup";
import { useRef } from "react";

import Navbar from "../components/navbar";
import Loader from "../components/loader";

import "../index.css";

const RegisterNonClub = () => {
  var [username, setUserName] = useState("");
  var [password, setPassword] = useState("");
  var [stdID, setstdID] = useState("");
  var [name, setName] = useState("");

  const usernameChange = (e) => {
    setUserName(e.target.value);
  };
  const passwordChange = (e) => {
    setPassword(e.target.value);
  };
  const stdIDChange = (e) => {
    setstdID(e.target.value);
  };
  const nameChange = (e) => {
    setName(e.target.value);
  };

  //Username Error Popup
  const [usernameErrorStatus, setUserNameErrorStatus] = useState(false);

  //Account Name Duplicate Error
  const [accnameErrorStatus, setAccNameErrorStatus] = useState(false);

  //Student ID not match Error
  const [stdIDerror, setstdIDerror] = useState(false);

  //Otp Sent Error
  const [otpSentErrorStatus, setotpSentErrorStatus] = useState(false);

  //Otp Verification
  const [otpEnterStatus, setotpEnterStatus] = useState(false);
  const [recievedOtp, setReOTP] = useState("");

  //User Otp Handle
  const [userOtp, setuserOtp] = useState("");
  const otpChange = (e) => {
    setuserOtp(e.target.value);
  };

  //Handle Otp Verification Popup Closed
  const otpCancel = () => {
    setReOTP("");
    setPopupStatus(false);
  };

  var [isLoading,setIsLoading] = useState(false)

  const navigate = useNavigate();

  async function submitData() {
    if (!username || !password || !name || !stdID) {
      return;
    }

    setIsLoading(true)

    var api = `http://localhost:5000/checkUsername`;
    var email = `s${stdID}@email.kmutnb.ac.th`
    var body = {
      username: username,
      accountName: name,
      stdID: stdID,
      email : email
    };
    var response = await axios.post(api, body);
    if (response.data.Status == true) {
      setUserNameErrorStatus(true);
      setIsLoading(false)
      return;
    }

    api = `http://localhost:5000/checkAccname`;
    response = await axios.post(api, body);
    if (response.data.Status == true) {
      setAccNameErrorStatus(true);
      setIsLoading(false)
      return;
    }

    api = `http://localhost:5000/checkstdID`;
    response = await axios.post(api, body);
    if (response.data.Status == false) {
      setstdIDerror(true);
      setIsLoading(false)
      return;
    }

    api = `http://localhost:5000/Sendotp/`;
    response = await axios.post(api, body);
    if (response.data.success == false) {
      setotpSentErrorStatus(true);
      setIsLoading(false)
      return;
    }

    setReOTP(response.data.OTP);
    setotpEnterStatus(true);
    setIsLoading(false)
    return;
  }

  const [otpIncorrect, setOtpIncorrect] = useState(false);
  const [createAccError, setCreateAccError] = useState(false);
  const [createAccSuccess, setCreateAccSuccess] = useState(false);

  async function submitOTP() {
    setotpEnterStatus(false);
    if (userOtp != recievedOtp) {
      setOtpIncorrect(true);
      setuserOtp("");
      return;
    }
    setuserOtp("");
    var api = `http://localhost:5000/registerClubMember/`;
    var body = {
      username: username,
      password: password,
      accountName: name
    };
    var response = await axios.post(api, body);
    if (response.data.success == false) {
      setCreateAccError(true);
      return;
    }

    setCreateAccSuccess(true);

    setTimeout(() => {
      navigate("/");
  }, 1000);
  return
  }

  return (
    <>
     <Navbar />
      <div className="registerPage">
        <div className="registerBox">
            Registration For ...
            <div className="selectRegisterBox">
                <div className="userType"><Link to="/RegisterClub">Club Member</Link></div>
                <div className="userType"><Link to="/RegisterNonClub">External User</Link></div>
            </div>
        </div>
      </div>
    </>
  );
};

export default RegisterNonClub;
