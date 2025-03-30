import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ShowPosts from './components/ShowPost';
import News from './components/News';
import Nav from '../components/navbar';

const Main = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const [role, setRole] = useState(0);
    const [userID, setUserId] = useState(0);
    // 0=guest  1=externalUser  2=clubMember  3=admin

    useEffect(() => {
        if (!state) {
            //////// for guest
            setRole(0);
        }
        else {
            axios.get("http://localhost:5000/getRole", { params: { userId: state.userId } })
                .then(response => {
                    if (response.data) {
                        setUserId(state.userId);
                        setRole(response.data);
                    } else {
                        navigate('/');
                    }
                })
        }
    }, []);

    return (
        <div className="min-h-screen bg-bgColor">
            {role !== 0 ? <Nav userID={userID} /> : <Nav userID={null} />}
            <br /><br />

            <News role={role} />
            <ShowPosts userId={userID} role={role} />

            <br />
        </div >
    );
}


export default Main;