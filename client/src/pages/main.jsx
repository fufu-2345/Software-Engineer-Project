import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ShowPosts from './components/ShowPost';
import News from './components/News';
import Nav from '../components/navbar';
import ProfileShowPost from './components/profileShowPost';

///// dropzoneDoc: https://react-dropzone.js.org/

//// DELETE FROM post WHERE postID>1 && postID<100;

const Main = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const [role, setRole] = useState(0);
    const [userID, setUserId] = useState(0);
    // 0=guest  1=externalUser  2=clubMember  3=admin

    // ************** not done **************** 
    //////// ดักคลิกข้างนอกระหว่าง add 
    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            setIsAdding(false);
        }
    };


    useEffect(() => {
        //////// ดัก login มั่ว
        if (!state) {
            setRole(0);
            //navigate('/');
        }
        else {
            console.log(state)
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
            {role === 0 && (
                /*{!!!!!!}*/
                <div className="fixed left-1/2 transform -translate-x-1/2 w-[10%] h-[10%] z-100 bg-green-600 flex items-center justify-center cursor-pointer rounded" onClick={() => navigate('/login')}>
                    <p className='text-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>login</p>
                </div>
            )}

            {/*<Nav role={role} />*/}
            {/*<h1>{role ? role.roleID : "Loading..."}</h1>*/}
            <br /><br />

            <News role={role} />
            <ShowPosts userId={userID} role={role} />

            <br />
        </div >
    );
}


export default Main;