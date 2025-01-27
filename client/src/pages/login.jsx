import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    return (
        <>
            <h1>Login</h1><br/>
            <div><Link to="/main"><h1>Main</h1></Link></div>
            <br/><br/>
        </>
    );
    
}

export default Login;