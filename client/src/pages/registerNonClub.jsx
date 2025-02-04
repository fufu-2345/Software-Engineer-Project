import React, { useState, useEffect, useReducer } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Popup from "reactjs-popup";
import { useRef } from "react";

import "../index.css";

const RegisterNonClub = () => {
  var [username, setUserName] = useState("");
  var [password, setPassword] = useState("");
  var [email, setEmail] = useState("");
  var [name, setName] = useState("");

  const usernameChange = (e) => {
    setUserName(e.target.value);
  };
  const passwordChange = (e) => {
    setPassword(e.target.value);
  };
  const emailChange = (e) => {
    setEmail(e.target.value);
  };
  const nameChange = (e) => {
    setName(e.target.value);
  };

  //Username Error Popup
  const [usernameErrorStatus, setUserNameErrorStatus] = useState(false);

  //Account Name Duplicate Error
  const [accnameErrorStatus, setAccNameErrorStatus] = useState(false);

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
  const registerError = useRef();
  const registerSuccess = useRef();

  const navigate = useNavigate();

  async function submitData() {
    var api = `http://localhost:5000/checkUsername`;
    var body = {
      username: username,
      password: password,
      accountName: name,
      email: email,
    };
    var response = await axios.post(api, body);
    if (response.data.Status == true) {
      setUserNameErrorStatus(true);
      return;
    }

    api = `http://localhost:5000/checkAccname`;
    response = await axios.post(api, body);
    if (response.data.Status == true) {
      setAccNameErrorStatus(true);
      return;
    }

    api = `http://localhost:5000/Sendotp/`;
    response = await axios.post(api, body);
    if (response.data.success == false) {
      setotpSentErrorStatus(true);
      return;
    }

    setReOTP(response.data.OTP);
    setotpEnterStatus(true);
    return;
  }

  const [otpIncorrect, setOtpIncorrect] = useState(false);
  const [otpCorrect, setOtpCorrect] = useState(false);

  async function submitOTP() {
    setotpEnterStatus(false);
    if (userOtp != recievedOtp) {
      setOtpIncorrect(true);
      return;
    }

    var api = `http://localhost:5000/registerNonClubMember/`;
    var body = {
      username: username,
      password: password,
      accountName: name,
      email: email,
    };
    var response = await axios.post(api, body);
    if (response.data.success == false) {
      setOtpIncorrect(true);
      return;
    }

    setOtpCorrect(true);

    setTimeout(() => {
      navigate("/Main");
    }, 2000);
  }

  return (
    <>
    <div className="registerBox">
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
    </div>
      {/* Username error popup */}
      <Popup
        open={usernameErrorStatus}
        onClose={() => setUserNameErrorStatus(false)}
        modal
      >
        <div>
          <p>This Username is already in use.</p>
          <button onClick={() => setUserNameErrorStatus(false)}>Close</button>
        </div>
      </Popup>
      <Popup
        open={accnameErrorStatus}
        onClose={() => setAccNameErrorStatus(false)}
        modal
      >
        <div>
          <p>This Account Name is already in use.</p>
          <button onClick={() => setAccNameErrorStatus(false)}>Close</button>
        </div>
      </Popup>
      {/* OTP sent error popup */}
      <Popup
        open={otpSentErrorStatus}
        onClose={() => setOtpSentErrorStatus(false)}
        modal
      >
        <div>
          <p>Cannot send OTP to this Email, Please try again.</p>
          <button onClick={() => setOtpSentErrorStatus(false)}>Close</button>
        </div>
      </Popup>
      {/* OTP entry popup */}
      <Popup
        open={otpEnterStatus}
        onClose={() => setotpEnterStatus(false)}
        modal
      >
        <div>
          <input value={userOtp} onChange={otpChange} />
          <button onClick={submitOTP}>Submit</button>
          <button onClick={() => setotpEnterStatus(false)}>Close</button>
        </div>
      </Popup>
      <Popup open={otpIncorrect} onClose={() => setOtpIncorrect(false)} modal>
        <div>
          <p>Wrong OTP</p>
          <button onClick={() => setOtpIncorrect(false)}>Close</button>
        </div>
      </Popup>
      <Popup open={otpIncorrect} onClose={() => setOtpIncorrect(false)} modal>
        Cannot register, Please try again later
      </Popup>
      <Popup open={otpCorrect} onClose={() => setOtpCorrect(false)} modal>
        Register Success
      </Popup>
    </>
  );
};

export default RegisterNonClub;
