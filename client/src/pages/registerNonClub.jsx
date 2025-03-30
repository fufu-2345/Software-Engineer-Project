import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Popup from "reactjs-popup";

import Navbar from "../components/navbar";
import Loader from "../components/loader";

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

  var [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate();

  async function submitData() {
    if (!username || !password || !name || !email) {
      return;
    }

    setIsLoading(true)

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
    var api = `http://localhost:5000/registerNonClubMember/`;
    var body = {
      username: username,
      password: password,
      accountName: name,
      email: email,
    };
    var response = await axios.post(api, body);
    if (response.data.success == false) {
      setCreateAccError(true);
      return;
    }

    api = `http://localhost:5000/login/`
    response = await axios.post(api, body);
    var data = {}
    if (response.data.Status == false) {
      data = { userId: null }
    } else {
      data = { userId: response.data.ID }
    }

    setCreateAccSuccess(true);

    setTimeout(() => {
      navigate("/Main", { state: data });
    }, 1000);
  }

  return (
    <>
      <Navbar />
      <div className="registerPage">
        <div className="registerBox">
          Register Form
          <div className="registerTopicInputBox">
            Username
            <br></br>
            <input
              className="registerInputBox"
              value={username}
              onChange={usernameChange}
            />
            <br></br>
          </div>
          <div className="registerTopicInputBox">
            Password
            <br></br>
            <input
              type="password"
              className="registerInputBox"
              value={password}
              onChange={passwordChange}
            />
            <br></br>
          </div>
          <div className="registerTopicInputBox">
            Name
            <br></br>
            <input
              className="registerInputBox"
              value={name}
              onChange={nameChange}
            />
            <br></br>
          </div>
          <div className="registerTopicInputBox">
            Email
            <br></br>
            <input
              className="registerInputBox"
              value={email}
              onChange={emailChange}
            />
            <br></br>
          </div>
          <button className="registerButton" onClick={submitData}>
            Submit
          </button>
          {isLoading && <Loader />}
        </div>
        {/* Username error popup */}
        <Popup
          open={usernameErrorStatus}
          onClose={() => setUserNameErrorStatus(false)}
          modal
          className="popup-content"
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
          className="popup-content"
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
          className="popup-content"
        >
          <div>
            <p>Cannot send OTP to this Email, Please try again.</p>
            <button onClick={() => setOtpSentErrorStatus(false)}>Close</button>
          </div>
        </Popup>
        {/* OTP entry popup */}
        <Popup
          open={otpEnterStatus}
          onClose={() => { setotpEnterStatus(false); setuserOtp("") }}
          modal
          className="popup-content"
        >
          <div>
            <button
              className="popup-close"
              onClick={() => setotpEnterStatus(false)}
            >
              x
            </button>
            We have send an OTP Verification to your email
            <br />
            <br></br>
            Please Enter OTP
            <br></br>
            <input className="otpInputBox" value={userOtp} onChange={otpChange} />
            <br />
            <button className="popup-button" onClick={submitOTP}>
              Submit OTP
            </button>
          </div>
        </Popup>
        <Popup
          open={otpIncorrect}
          onClose={() => setOtpIncorrect(false)}
          modal
          className="popup-content"
        >
          <div>
            <p>Wrong OTP</p>
            <button onClick={() => setOtpIncorrect(false)}>Close</button>
          </div>
        </Popup>
        <Popup
          open={createAccError}
          onClose={() => setCreateAccError(false)}
          modal
          className="popup-content"
        >
          <button
            className="popup-close"
            onClick={() => setotpEnterStatus(false)}
          >
            x
          </button>
          Cannot register, Please try again later
        </Popup>
        <Popup
          open={createAccSuccess}
          onClose={() => setCreateAccSuccess(false)}
          modal
          className="popup-content"
        >
          <button
            className="popup-close"
            onClick={() => setotpEnterStatus(false)}
          >
            x
          </button>
          Register Success
        </Popup>
      </div>
    </>
  );
};

export default RegisterNonClub;
