import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Main = () => {
    return (
        <>
            <h1 className='text-xl'>Main</h1><br />
            <div><Link to="/"><h1>back</h1></Link></div>
            <br /><br />
        </>
    );

}

export default Main;