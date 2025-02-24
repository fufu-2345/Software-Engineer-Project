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
    const [postImgs, setPostImgs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const maxVisitPage = 5;

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
        /*************      เพิ่มขึ้น text เตือน     ************ */
        if (!file || !title) return;

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


    useEffect(() => {
        //////// ดัก login มั่ว
        if (!state) {
            navigate('/');
        }
        console.log(`get data: ${state.test} , ${state.userId}`);

        axios.get("http://localhost:5000/getPost/Count")
            .then(response => {
                setPostCount(parseInt(response.data));
            })
            .catch(error => {
                console.error("Error getPost/Count(useEffect): ", error);
            });


        axios.get("http://localhost:5000/getPost/imgs")
            .then(response => {
                setPostImgs(response.data);
            })
            .catch(error => {
                console.error("Error getPost/imgs(useEffect): ", error);
            });
        console.log(postImgs);

    }, []);

    const PageNAV = () => {
        const maxVisiblePages = 5;
        const totalPage = Math.ceil(postCount / 50);

        const startPage = Math.max(1, currentPage - maxVisiblePages);
        const endPage = Math.min(totalPage, currentPage + maxVisiblePages);

        const changePage = (page) => {
            if (page >= 1 && page <= totalPage) {
                setCurrentPage(page);
            }
        };

        return (
            <div className="flex items-center justify-center space-x-2 bg-black py-2">
                <button onClick={() => changePage(1)} className="text-white text-lg rounded-full hover:bg-gray-500 w-7 h-7 flex items-center justify-center leading-none">
                    <span className="flex items-center justify-center">{'<<'}</span>
                </button>

                <button onClick={() => changePage(currentPage - 1)} className="text-white text-lg rounded-full hover:bg-gray-500 w-7 h-7 flex items-center justify-center leading-none">
                    <span className="flex items-center justify-center">{'<'}</span>
                </button>

                {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
                    const page = startPage + index;
                    return (
                        <button key={page} onClick={() => changePage(page)} className={`text-white px-3 py-1 rounded-full ${page === currentPage ? "bg-gray-600 text-white" : "hover:bg-gray-500"}`}>
                            {page}
                        </button>
                    );
                })}

                <button onClick={() => changePage(currentPage + 1)} className="text-white text-lg rounded-full hover:bg-gray-500 w-7 h-7 flex items-center justify-center leading-none">
                    <span className="flex items-center justify-center">{'>'}</span>
                </button>

                <button onClick={() => changePage(totalPage)} className="text-white text-lg rounded-full hover:bg-gray-500 w-7 h-7 flex items-center justify-center leading-none">
                    <span className="flex items-center justify-center">{'>>'}</span>
                </button>

            </div>
        );
    }

    const ShowPosts = () => {
        const column = 5; // จำนวนคอลัมน์ต่อแถว
        const postPerPage = column * 10;

        const start = (currentPage - 1) * postPerPage;
        const stop = start + postPerPage - 1;

        return (
            <div className='bg-black w-[100%] p-3'>
                <div className='grid grid-cols-5 gap-3'>

                    {postImgs.slice(start, stop + 1).map((img, index) => (
                        <div key={index} className='bg-white border border-gray-400 flex justify-center items-center h-[200px] cursor-pointer'>
                            <img src={`http://localhost:5000/imgs/${img}`} alt="postImg" className='max-w-[100%] max-h-[100%]' title={img} />
                        </div>
                    ))}
                </div>
                <br />
                <PageNAV />

            </div>
        );
    };

    const Refresh = () => {
        axios.get("http://localhost:5000/getPost/Count")
            .then(response => {
                setPostCount(parseInt(response.data));
            })
            .catch(error => {
                console.error("Error getPost/Count(Refresh): ", error);
            });


        axios.get("http://localhost:5000/getPost/imgs")
            .then(response => {
                setPostImgs(response.data);
            })
            .catch(error => {
                console.error("Error getPost/imgs(Refresh): ", error);
            });
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
                    {/* input post ชื่อ */}
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

                    {/* input post description */}
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

            <div className='relative bg-yellow-300 w-[90%] mx-auto'>
                <button className='absolute top-0 right-0 bg-red-400 rounded-2xl p-2.5' onClick={Refresh}>
                    Refresh
                </button>
                <br /><br />
                <ShowPosts />
            </div>


            <br />
            <br />
        </div>
    );
}


export default Main;