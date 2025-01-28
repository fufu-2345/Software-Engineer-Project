import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDropzone } from 'react-dropzone'
import axios from 'axios';


///// dropzoneDoc: https://react-dropzone.js.org/

const Main = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const [isAdding, setIsAdding] = useState(false);
    const [file, setFile] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles?.length) {
            const getFile = acceptedFiles[0];
            console.log(getFile);
            setFile(Object.assign(getFile, { preview: URL.createObjectURL(getFile) }));
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,   /// img cap size
        accept: { 'image/*': [] },
    });

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                alert('Upload successful!');
            } else {
                alert('Upload failed.');
            }
        } catch (error) {
            console.error(error);
            alert('Error uploading file.');
        }
    };

    const handleIsAdding = () => {
        if (isAdding == true) {
            setFile(null);
        }
        setIsAdding(!isAdding);
    };


    // ************** not done **************** 
    //////// ดักคลิกข้างนอกระหว่าง add 
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
            <h1 className='font-bold text-4xl'>Main</h1><br />
            <div><Link to="/"><h1>back</h1></Link></div>
            <button onClick={() => console.log(state.userId)}> show userId </button>
            <br /><br />

            <button onClick={handleIsAdding} className='border-2'> add img </button>
            {isAdding && <div
                className='flex flex-col justify-center items-center bg-blue-300 p-4  border-4  w-[80%] mx-auto rounded-lg'>
                <div {...getRootProps()} className=' bg bg-red-300 border-2 border-dashed border-gray-500 p-4 cursor-pointer'>
                    <input {...getInputProps()} />
                    {isDragActive ?
                        <p>Drop the files here ...</p> : <p>Drag & drop your picture here</p>
                    }
                </div>
                <div className='flex justify-center items-center bg-grey-300 bg-clip-padding p-3'>
                    {file && (
                        <>

                            <img src={file.preview} alt="Uploaded Preview"
                                className='w-auto h-auto min-w-[100px] max-w-[300px] min-h-[100px] max-h-[300px] block my-4' />

                            <button onClick={handleUpload} className='px-4 py-2 bg-blue-500 text-white rounded block my-4'>
                                confirm
                            </button>

                        </>
                    )}
                </div>
            </div>}
            <br />

            <br />
        </>
    );
}


export default Main;