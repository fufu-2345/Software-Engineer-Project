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
    const [file, setFile] = useState(null);                     // file
    const [errorMessage, setErrorMessage] = useState("");       // error message
    const [title, setTitle] = useState('');                     // ชื่อ post
    const [description, setDescription] = useState('');         // post detail
    const [postCount, setPostCount] = useState(0);


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

    const handleClearFile = (event) => {
        event.stopPropagation();
        setErrorMessage("");
        setFile(null);
    };

    const handleClearTitle = (event) => {
        setTitle("");
    };

    const handleClearFileDescription = (event) => {
        setDescription("");
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
        formData.append('postName', title);
        formData.append('postDescription', description);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                setIsAdding(false);
                setFile(null);
                setErrorMessage("");
                setTitle("");
                setDescription("");


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

        axios.get("http://localhost:5000/getPost/Count")
            .then(response => {
                setPostCount(parseInt(response.data));
            })
            .catch(error => {
                console.error("Error fetching post count:", error);
            });
    }, []);

    const BoxGrid = () => {
        const columns = 5;   /// cap จำนวน post ใน 1 row
        const rows = Math.ceil(postCount / columns);

        return (
            <div className='bg-black w-[80%] h-[400px] mx-auto flex flex-wrap '>
                {Array.from({ length: postCount }).map((_, index) => (
                    <div key={index} className='w-[20%] h-[80px] bg-white border border-gray-400 flex justify-center items-center cursor-pointer'>
                        {index + 1}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-bgColor">
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
                        <div className='relative  flex justify-center items-center w-full h-full'>
                            <button onClick={handleClearFile} className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white text-lg font-bold rounded-full flex items-center justify-center shadow-md hover:bg-red-700">
                                X
                            </button>
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

                <div className='flex flex-col items-center bg-grey-300 bg-clip-padding p-3 w-full'>
                    {/* input ชื่อ post */}
                    <div className="relative w-full max-w-lg">
                        <textarea value={title} onChange={handleTitle} placeholder='Enter your post name'
                            className='w-full p-2 border rounded-md resize-none h-[80px] overflow-y-auto mt-3'
                        />
                        {title && (
                            <button onClick={() => setTitle("")}
                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white text-lg font-bold rounded-full flex items-center justify-center shadow-md hover:bg-red-700">
                                X
                            </button>
                        )}
                    </div>

                    <br />

                    {/* input description */}
                    <div className="relative w-full max-w-lg">
                        <textarea value={description} onChange={handleDescription} placeholder='Enter the description'
                            className='w-full p-2 border rounded-md resize-none h-[225px] overflow-y-auto mt-1'
                        />
                        {description && (
                            <button onClick={() => setDescription("")}
                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white text-lg font-bold rounded-full flex items-center justify-center shadow-md hover:bg-red-700">
                                X
                            </button>
                        )}
                    </div>
                </div>

                <div className='flex flex-col items-center bg-grey-300 bg-clip-padding p-3'>
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

            <BoxGrid />
        </div>
    );
}


export default Main;