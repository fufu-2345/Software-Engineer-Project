import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PostDetail = () => {
    return (
        <>
            <h1>PostDetail</h1><br/>
            <div><Link to="/"><h1>back</h1></Link></div>
            <br/><br/>
        </>
    );
    
}

export default PostDetail;