import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();

    const handleGoMain = () => {
        const data = { test: 'AAA', userId: 20 };
        navigate('/Main', { state: data });
    };

    return (
        <>
            <h1 className='font-bold text-4xl'>Login</h1><br />
            <button onClick={handleGoMain}> Main </button>

            <br /><br />

        </>
    );

}

export default Login;