import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDropzone } from 'react-dropzone'
import axios from 'axios';


///// dropzoneDoc: https://react-dropzone.js.org/

//// DELETE FROM post WHERE postID>1 && postID<100;

const Main = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    const [isAdding, setIsAdding] = useState(false);
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');


    const handleTitle = (event) => {
        setTitle(event.target.value);
    };

    const handleDescription = (event) => {
        setDescription(event.target.value);
    };

    const handleCancle = (event) => {
        setFile(null);
        setErrorMessage("");
        setTitle("");
        setDescription("");
        setIsAdding(false);
    };


    const onDrop = useCallback(acceptedFiles => {
        setErrorMessage("");
        if (acceptedFiles?.length) {
            const getFile = acceptedFiles[0];
            console.log(getFile);
            setFile(Object.assign(getFile, { preview: URL.createObjectURL(getFile) }));
        }
    }, []);

    const onDropRejected = useCallback(fileRejections => {
        fileRejections.forEach(({ errors }) => {
            errors.forEach(error => {
                if (error.code === "file-invalid-type") {
                    setErrorMessage("ไม่รองรับไฟล์สกุลดังกล่าว");
                } else if (error.code === "too-many-files") {
                    setErrorMessage("ไม่สามารถอัปโหลดเกิน 1 ไฟล์ได้");
                }
            });
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected,
        maxFiles: 1,   /// img cap size
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/bmp': [],
            'image/tiff': [],
            'image/webp': [],
            'image/heif': [],
            'image/heic': [],
            'image/x-raw': []
        }      /// img type fix
    });

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file);
        formData.append('userId', state.userId);

        /*console.log("formData: ");
        formData.forEach((value, key) => {
            console.log(key, value);
        });*/

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                setIsAdding(false);
                setFile(null);
                console.log('Upload successful!');
            } else {
                //alert('Upload failed.');
                console.log('Upload failed 1');
            }
        } catch (error) {
            //alert('Error uploading file.');
            console.log('Upload failed 2');
        }
    };

    const handleIsAdding = () => {
        if (isAdding == true) {
            setFile(null);
            setErrorMessage("");
            setTitle("");
            setDescription("");
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

    //////// ดัก login มั่ว
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
                <div {...getRootProps()} className='flex flex-col justify-center items-center bg bg-red-300 w-[60%] h-[400px] border-2 border-dashed border-gray-500 p-4 cursor-pointer'>
                    <input {...getInputProps()} />
                    {isDragActive ?
                        <p className="mb-4 font-bold">Drop the files here ...</p> : <p className="mb-4 font-bold">Drag & drop your picture here</p>
                    }
                    {file && (
                        <div className='flex justify-center items-center w-full h-full'>
                            <img src={file.preview} alt="Uploaded Preview"
                                className='bg-blue-200 max-w-[300px] max-h-[300px] block p-3 border-3 border-black border-dashed' />
                        </div>
                    )}


                </div>

                {errorMessage && (
                    <div className='text-red-500 text-[20px] mt-3 font-semibold cursor-default'>
                        {errorMessage}
                    </div>
                )}

                <div className='flex flex-col items-center bg-grey-300 bg-clip-padding p-3'>
                    <textarea value={title} onChange={handleTitle} placeholder='Enter your post name'
                        className='w-[300%] p-2 border rounded-md resize-none h-[80px] overflow-y-auto mt-3'
                    />

                    <br />

                    <textarea value={description} onChange={handleDescription} placeholder='Enter the description'
                        className='w-[300%] p-2 border rounded-md resize-none h-[225px] overflow-y-auto mt-1'
                    />

                    <div class="flex space-x-4 ">
                        <div className='w-full flex justify-center'>
                            <button onClick={handleCancle} className='px-4 py-2 bg-red-500 text-white rounded block my-4'>
                                cancle
                            </button>
                        </div>

                        <div className='w-full flex justify-center'>
                            <button onClick={handleUpload} className='px-4 py-2 bg-blue-500 text-white rounded block my-4'>
                                confirm
                            </button>
                        </div>
                    </div>

                </div>

            </div>}
            <br />

            <br />
        </>
    );
}


export default Main;