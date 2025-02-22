import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    var [username,setusername] = useState("")
    var [password,setpassword] = useState("")
    return (
        <>
            <h1>Login</h1><br />
            <div><Link to="/main"><h1>back</h1></Link></div>
            <br /><br />
        </>
    );

}

export default Login;