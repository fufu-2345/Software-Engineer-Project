import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom';

const ShowPost = ({ userId, role }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [postCount, setPostCount] = useState(0);
    const [postImgs, setPostImgs] = useState([]);
    const [searchVal, setSearchVal] = useState("");
    const [mode, setMode] = useState(true);
    const [sortMode, setSortMode] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [proCount, setProCount] = useState(0);
    const [proImgs, setProImgs] = useState([]);
    const [profileDropdown, setprofileDropdown] = useState(false);
    const [userName, setUserName] = useState([]);
    const [searchUserId, setsearchUserId] = useState([]);
    const navigate = useNavigate();
    const maxVisitPage = 5;
    const column = 4; // จำนวนคอลัมน์ต่อแถว
    const postPerPage = column * 5;
    const start = (currentPage - 1) * postPerPage;
    const stop = start + postPerPage - 1;
    const totalPage = Math.max(1, Math.ceil(postCount / 20));
    const startPage = Math.max(1, currentPage - Math.floor(maxVisitPage));
    const endPage = Math.min(totalPage, currentPage + Math.floor(maxVisitPage));

    const profileRef = useRef(null);
    const profileButtonRef = useRef(null);

    const changePage = (page) => {
        if (page >= 1 && page <= totalPage) {
            setCurrentPage(page);
        }
    };

    const handleOutsideClick = (event) => {
        if (event.target.id === "popup-overlay") {
            setIsAdding(false);
            setprofileDropdown(false);
        }
    };

    const handleClickOutside = (event) => {
        if (profileRef.current && !profileRef.current.contains(event.target) && !profileButtonRef.current.contains(event.target)) {
            setprofileDropdown(false);
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const onDrop = useCallback(acceptedFiles => {
        setErrorMessage("");
        if (acceptedFiles?.length) {
            const getFile = acceptedFiles[0];
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

    const handleUpload = async () => {
        if (role == 1 || role == 2) {
            console.log('คุณไม่มีสิทธิ์ในการอัปโหลดรูปภาพ');
            return;
        }

        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        formData.append('userId', userId);
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
            }
        } catch (error) {
            //console.log('Upload failed 2');
        }
    };

    const handleNav = (index) => {
        navigate('/profile', { state: { userId: userId, loggedInUser: searchUserId[index] } });
    };

    const handleTitle = (event) => {
        setTitle(event.target.value);
    };

    const handleDescription = (event) => {
        setDescription(event.target.value);
    };

    const handleCancle = () => {
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

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSetMode = () => {
        setIsOpen(false);
        setSortMode(true);
        setMode(true);

        const params = {
            sortMode: sortMode ? 'DESC' : 'ASC',
            mode: mode ? 'postID' : 'avgRating',
            search: ""
        };

        axios.get("http://localhost:5000/getPost/imgs", { params })
            .then(response => {
                setPostCount(response.data.length);
                setPostImgs(response.data);
                //setPicOrProfile(true);
            })
            .catch(error => {
                console.error("Error getPost/imgs(handleSearch): ", error);
            });
    };

    const handleSetMode2 = () => {
        setIsOpen(false);
        setSortMode(true);
        setMode(false);

        const params = {
            sortMode: sortMode ? 'DESC' : 'ASC',
            mode: mode ? 'postID' : 'avgRating',
            search: ""
        };

        axios.get("http://localhost:5000/getPost/imgs", { params })
            .then(response => {
                setPostCount(response.data.length);
                setPostImgs(response.data);
            })
            .catch(error => {
                console.error("Error getPost/imgs(handleSearch): ", error);
            });
    };

    const handleSearch = () => {
        if (searchVal !== "") {
            const params = {
                search: searchVal
            };
            //                               get Profile pic
            axios.get("http://localhost:5000/getProfile/imgs", { params })
                .then(response => {
                    setProCount(response.data.length);
                    setProImgs(response.data);
                })
                .catch(error => {
                    console.error("Error getPost/imgs(handleSearch): ", error);
                });
            //                               get user name 
            axios.get("http://localhost:5000/getProfile/name", { params })
                .then(response => {
                    setUserName(response.data);
                })
                .catch(error => {
                    console.error("Error getPost/imgs(handleSearch): ", error);
                });
            setprofileDropdown(true);

            //                               get user ID
            axios.get("http://localhost:5000/getProfile/userID", { params })
                .then(response => {
                    setsearchUserId(response.data);
                })
                .catch(error => {
                    console.error("Error getPost/imgs(handleSearch): ", error);
                });
            setprofileDropdown(true);
        }
        else {
            setprofileDropdown(false);
        }
    };

    const handleSearchVal = (event) => {
        setSearchVal(event.target.value);
    };

    const handleSortMode = () => {
        setSortMode(!sortMode);
        const params = {
            sortMode: sortMode ? 'ASC' : 'DESC',
            mode: mode ? 'postID' : 'avgRating',
            search: ""
        };

        axios.get("http://localhost:5000/getPost/imgs", { params })
            .then(response => {
                setPostCount(response.data.length);
                setPostImgs(response.data);
            })
            .catch(error => {
                console.error("Error getPost/imgs(handleSearch): ", error);
            });
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

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected,
        maxFiles: 1,   /// img cap size
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/bmp': [],
            'image/webp': []
        }      /// img type fix
    });

    const Dropdown = () => {
        return (
            <div className="relative inline-block text-left">
                <button onClick={toggleDropdown} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md">
                    {mode ? 'newest' : 'score'}
                </button>
                {isOpen && (
                    <div className="absolute left-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                        <button onClick={handleSetMode} className="block w-full px-4 py-2 text-left hover:bg-red-400 hover:text-white">newest</button>
                        <button onClick={handleSetMode2} className="block w-full px-4 py-2 text-left hover:bg-red-400 hover:text-white">score</button>
                    </div>
                )}
            </div>
        )
    };

    useEffect(() => {
        const params = {
            sortMode: sortMode ? 'DESC' : 'ASC',
            mode: mode ? 'postID' : 'avgRating',
            search: ""
        };

        axios.get("http://localhost:5000/getPost/imgs", { params })
            .then(response => {
                setPostCount(response.data.length);
                setPostImgs(response.data);
            })
            .catch(error => {
                console.error("Error getPost/imgs(handleSearch): ", error);
            });
    }, []);

    const goPostDetail = (img) => {
        if (img) {
            const postId = parseInt(img.split('.')[0]);
            navigate(`/post`, { state: { userId: userId, postId: postId } });
        }
    }

    return (
        <>
            {isAdding &&
                <div id="popup-overlay" className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40" onClick={handleOutsideClick} >
                    <div className=' content-area fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center bg-red-300 p-4 border-4 w-[80%] h-[90vh] overflow-y-auto mx-auto rounded-lg z-50' onClick={(e) => e.stopPropagation()}>
                        <style>
                            {`
                        .content-area::-webkit-scrollbar {
                            display: none;
                        }
                        .content-area {
                            overflow-y: scroll;
                        }
                    `}
                        </style>
                        <div {...getRootProps()} className='flex flex-col justify-center items-center bg bg-[#ffd1dd] w-[60%] min-h-[500px] border-2 border-dashed border-gray-500 p-4 cursor-pointer'>
                            <input {...getInputProps()} />
                            {isDragActive ?
                                <p className="mb-4 font-bold">Drop the files here ...</p> : <p className="mb-4 font-bold">Drag & drop your picture here</p>
                            }
                            {file && (
                                <div className='relative  flex justify-center items-center w-full h-full'>
                                    <button onClick={handleClearFile} className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white text-lg font-bold rounded-full flex items-center justify-center shadow-md hover:bg-red-700">
                                        X
                                    </button>
                                    <img src={file.preview} className='bg-[#ffd1dd] max-w-[300px] max-h-[300px] block p-3 border-3 border-black border-dashed' />
                                </div>
                            )}
                        </div>

                        {errorMessage && (
                            <div className='text-red-500 text-[20px] mt-4 font-semibold cursor-default'>
                                {errorMessage}
                            </div>
                        )}

                        <div className='flex flex-col items-center bg-grey-300 bg-clip-padding p-3 w-full'>
                            <div className="relative w-full max-w-lg">
                                <textarea value={title} onChange={handleTitle} placeholder='Enter your post name' className='w-full p-2 border rounded-md resize-none h-[80px] overflow-y-auto mt-1' />
                                {title && (
                                    <button onClick={() => setTitle("")} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white text-lg font-bold rounded-full flex items-center justify-center shadow-md hover:bg-red-700">
                                        X
                                    </button>
                                )}
                            </div>
                            <br />

                            <div className="relative w-full max-w-lg">
                                <textarea value={description} onChange={handleDescription} placeholder='Enter the description' className='w-full p-2 border rounded-md resize-none h-[225px] overflow-y-auto mt-1' />
                                {description && (
                                    <button onClick={() => setDescription("")} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white text-lg font-bold rounded-full flex items-center justify-center shadow-md hover:bg-red-700">
                                        X
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className='flex flex-col items-center bg-grey-300 bg-clip-padding'>
                            <div class="flex space-x-4 ">
                                <div className='w-full flex justify-center'>
                                    <button onClick={handleCancle} className='bg-red-500 hover:bg-red-700  text-white px-4 py-2 m-2 rounded'>
                                        cancle
                                    </button>
                                </div>

                                <div className='w-full flex justify-center'>
                                    <button onClick={handleUpload} className='bg-green-500 hover:bg-green-700 text-white px-4 py-2 m-2 rounded'>
                                        confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            <div className='top-0 right-0 fixed position: fixed; flex items-center'>
                {(role.roleID == 1 || role.roleID == 2) &&
                    <button onClick={handleIsAdding} className="text-white bg-red-500 hover:bg-red-600 rounded-full w-12 h-12 flex items-center justify-center">
                        <p className="text-[32px] text-white leading-none relative top-[3px]">
                            +
                        </p>
                    </button>
                }
            </div>
            <div className='relative w-[90%] mx-auto mt-8'>
                <div className="absolute top-0 left-0">
                    <Dropdown />
                    <button className='rounded-2xl p-2.5 ml-2 bg-red-400 hover:bg-red-600 text-white' onClick={handleSortMode}>
                        Sort
                    </button>
                </div>
                <div className='absolute top-0 left-[37.5%] flex'>
                    <input type="text" value={searchVal} onChange={handleSearchVal} placeholder="type for search here" className="bg-white border-2 w-[275px] border-black rounded-2xl p-2.5" />
                    <button ref={profileButtonRef} className="bg-gray-400 hover:bg-gray-500 rounded-2xl p-2.5 ml-2 text-white" onClick={(e) => { e.stopPropagation(); handleSearch(); }} >
                        Search
                    </button>

                    {profileDropdown && (
                        <div className="absolute left-0 mt-12 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10" ref={profileRef} onClick={(e) => e.stopPropagation()}>
                            {proCount > 0 ? (
                                proImgs.map((profile, index) => (
                                    <div key={index} className="flex items-center p-2 border-b hover:bg-gray-100 cursor-pointer" onClick={() => handleNav(index)}>
                                        <img src={`http://localhost:5000/profilePicture/${profile}`} className='w-8 h-8 object-cover rounded-full' />
                                        <p className="ml-2 leading-none relative top-[7px]">{userName[index]}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="p-2 text-gray-500">No results found</p>
                            )}
                        </div>
                    )}


                </div>

                <br /><br /><br />
                <div className=' w-[100%] p-3 border'>
                    <div className='w-[100%] p-3 border'>
                        <div className='grid grid-cols-4 gap-3 pb-3'>
                            {Array.isArray(postImgs) && postImgs.length > 0 ? (
                                postImgs.slice(start, stop + 1).map((img, index) => (
                                    img ? (
                                        <div key={index} className='relative group flex justify-center items-center h-[300px] cursor-pointer'>
                                            <img src={`http://localhost:5000/imgs/${img}`} className='w-full h-full object-contain' onClick={() => goPostDetail(img)} />
                                        </div>
                                    ) : null
                                ))
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>

                    <br />

                    <div className="flex items-center justify-center space-x-2 py-2">
                        <button onClick={() => changePage(1)} className="group text-black text-lg rounded-full hover:bg-gray-500 hover:text-white w-7 h-7 flex items-center justify-center leading-none">
                            <span className="flex items-center justify-center group-hover:text-white">{'<<'}</span>
                        </button>

                        <button onClick={() => changePage(currentPage - 1)} className="group text-black text-lg rounded-full hover:bg-gray-500 hover:text-white w-7 h-7 flex items-center justify-center leading-none">
                            <span className="flex items-center justify-center group-hover:text-white">{'<'}</span>
                        </button>

                        {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
                            const page = startPage + index;
                            return (
                                <button key={page} onClick={() => changePage(page)} className={`text-black px-3 py-1 rounded-full ${page === currentPage ? "bg-gray-600 text-white" : "hover:bg-gray-500"}`}>
                                    {page}
                                </button>
                            );
                        })}

                        <button onClick={() => changePage(currentPage + 1)} className="group text-black text-lg rounded-full hover:bg-gray-500 hover:text-white w-7 h-7 flex items-center justify-center leading-none">
                            <span className="flex items-center justify-center group-hover:text-white">{'>'}</span>
                        </button>

                        <button onClick={() => changePage(totalPage)} className="group text-black text-lg rounded-full hover:bg-gray-500 hover:text-white w-7 h-7 flex items-center justify-center leading-none">
                            <span className="flex items-center justify-center group-hover:text-white">{'>>'}</span>
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default ShowPost;