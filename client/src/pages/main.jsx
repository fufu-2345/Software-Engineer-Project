import React, { useState, useEffect, useCallback ,useRef } from 'react';
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import {useDropzone} from 'react-dropzone'
import axios from 'axios';

const Main = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    

    const [isAdding, setIsAdding] = useState(false);

    const handleIsAdding = () => {
        setIsAdding(!isAdding);
    };


    const onDrop = useCallback(acceptedFiles => {
        console.log(acceptedFiles);
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    
    //////// ดักคลิกข้างระหว่าง add
    const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            setIsAdding(false);
        }
    };

    //////// ดัก login ผิดวิธี
    useEffect(() => {
        if (!state) {
            navigate('/');
        }
        console.log(`get data: ${state.test} , ${state.userId}`);
    }, []);

    return (
        <>
            <h1 className='font-bold text-4xl'>Main</h1><br/>
            <div><Link to="/"><h1>back</h1></Link></div>
            <button onClick={() => console.log(state.userId)}> show userId </button>
            <br/><br/>

            <button onClick={handleIsAdding} className='border-2'> add img </button>
            {isAdding && <div>
                <div {...getRootProps()} className=' bg bg-red-300 border-2 border-dashed border-gray-500 p-4 cursor-pointer'>
                    <input {...getInputProps()} />
                    {
                        isDragActive ?
                            <p>Drop the files here ...</p> :
                            <p>Drag 'n' drop some files here, or click to select files</p>
                    }
                </div>
            </div>}
            
            <br/><br/>
        </>
    );
}   


export default Main;