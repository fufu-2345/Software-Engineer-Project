import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Popup from "reactjs-popup";

import Loader from "../components/loader";

import "../index.css";

const Login = () => {
    var [username, setusername] = useState("");
    var [password, setpassword] = useState("");

    var [isLoading, setIsLoading] = useState(false)

    var [signInError, setSignInError] = useState(false)

    var [signInSuccess, setSignInSuccess] = useState(false)

    const navigate = useNavigate();

    async function submitData() {

        setIsLoading(true)
        var api = `http://localhost:5000/login`

        var body = {
            username: username,
            password: password
        };

        var response = await axios.post(api, body);

        setIsLoading(false)

        if (response.data.Status == false) {
            setSignInError(true)
            return
        }

        setSignInSuccess(true)

        setTimeout(() => {
            const data = { userId: response.data.ID };
            navigate("/Main", { state: data });
        }, 1000);
        return

    }

    const HandleGoMain = () => {
        const data = { userId: 20 };

        const handleClick = () => {
            navigate('/Main', { state: data });
        };

        return (
            <>
                <br /><br />
                <button onClick={handleClick}> Main </button>
                <br /><br />
            </>
        );
    };

    return (
        <>
            <div className="registerPage">
                <div className="registerBox">
                    Sign In
                    <div className="registerTopicInputBox">
                        Username
                        <br></br>
                        <input
                            className="registerInputBox"
                            value={username}
                            onChange={(e) => { setusername(e.target.value) }}
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
                            onChange={(e) => { setpassword(e.target.value) }}
                        />
                        <br></br>
                    </div>

                    <button className="registerButton" onClick={submitData}>
                        Submit
                    </button>
                    {isLoading && <Loader />}

                </div>

                <Popup
                    open={signInError}
                    onClose={() => setSignInError(false)}
                    modal
                    className="popup-content"
                >
                    <div>
                        <p>Wrong Username or Password</p>
                        <button onClick={() => setSignInError(false)}>Close</button>
                    </div>
                </Popup>

                <Popup
                    open={signInSuccess}
                    onClose={() => setSignInSuccess(false)}
                    modal
                    className="popup-content"
                >
                    <div>
                        <p>Login Success. Redirecting...</p>
                        <button onClick={() => setSignInSuccess(false)}>Close</button>
                    </div>
                </Popup>
            </div>
            <br></br>
            <HandleGoMain />

        </>
    );
};

export default Login;
