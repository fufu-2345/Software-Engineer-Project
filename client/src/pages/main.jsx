import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ShowPosts from './components/ShowPost';
import News from './components/News';
import ProfileShowPost from './components/profileShowPost';

///// dropzoneDoc: https://react-dropzone.js.org/

//// DELETE FROM post WHERE postID>1 && postID<100;

const Main = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { state } = location;
    //const [isOpen, setIsOpen] = useState(false);
    //const [isAdding, setIsAdding] = useState(false);
    //const [file, setFile] = useState(null);                     // file
    //const [errorMessage, setErrorMessage] = useState("");       // error message
    //const [title, setTitle] = useState('');                     // ชื่อ post
    //const [description, setDescription] = useState('');         // post detail
    //const [postCount, setPostCount] = useState(0);
    //const [postImgs, setPostImgs] = useState([]);
    //const [currentPage, setCurrentPage] = useState(1);
    //const [mode, setMode] = useState(true);
    //const [sortMode, setSortMode] = useState(true);
    //const [searchVal, setSearchVal] = useState("");
    //const [news, setNews] = useState(null);
    const [role, setRole] = useState(0);
    // 0=guest  1=externalUser  2=clubMember  3=admin

    /*const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };*/

    /*const handleSetMode = () => {
        setIsOpen(false);
        setMode(!mode);
    };*/

    /*const handleSortMode = () => {
        setSortMode(!sortMode);
    };*/

    /*const handleTitle = (event) => {
        setTitle(event.target.value);
    };*/

    /*const handleDescription = (event) => {
        setDescription(event.target.value);
    };*/

    /*const handleSearchVal = (event) => {
        setSearchVal(event.target.value);
    };*/

    /*const handleCancle = () => {
        setFile(null);
        setErrorMessage("");
        setTitle("");
        setDescription("");
        setIsAdding(false);
    };*/

    /*const handleClearFile = (event) => {
        event.stopPropagation();
        setErrorMessage("");
        setFile(null);
    };*/

    /*const onDrop = useCallback(acceptedFiles => {
        setErrorMessage("");
        if (acceptedFiles?.length) {
            const getFile = acceptedFiles[0];
            setFile(Object.assign(getFile, { preview: URL.createObjectURL(getFile) }));
        }
    }, []);*/

    /*const onDropRejected = useCallback(fileRejections => {
        fileRejections.forEach(({ errors }) => {
            errors.forEach(error => {
                if (error.code === "file-invalid-type") {
                    setErrorMessage("ไม่รองรับไฟล์สกุลดังกล่าว");
                } else if (error.code === "too-many-files") {
                    setErrorMessage("ไม่สามารถอัปโหลดเกิน 1 ไฟล์ได้");
                }
            });
        });
    }, []);*/

    /*const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected,
        maxFiles: 1,   /// img cap size
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/bmp': [],
            'image/webp': []
        }      /// img type fix
    });*/

    /*const handleUpload = async () => {
        /*************      เพิ่มขึ้น text เตือน     ************ 
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
    };*/

    /*const handleIsAdding = () => {
        if (isAdding == true) {
            setFile(null);
            setErrorMessage("");
            setTitle("");
            setDescription("");
        }
        setIsAdding(!isAdding);
    };*/

    /*const handleSearch = () => {
        const params = {
            sortMode: sortMode ? 'DESC' : 'ASC',
            mode: mode ? 'postID' : 'avgRating',
            search: searchVal
        };

        axios.get("http://localhost:5000/getPost/imgs", { params })
            .then(response => {
                setPostCount(response.data.length);
                setPostImgs(response.data);
            })
            .catch(error => {
                console.error("Error getPost/imgs(handleSearch): ", error);
            });
    };*/


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

        console.log(state.userId)
        axios.get("http://localhost:5000/getRole", { params: { userId: state.userId } })
            .then(response => {
                if (response.data) {
                    setRole(response.data);
                } else {
                    navigate('/');
                }
            })
            .catch(error => {
                console.error("Error fetching role:", error);
                navigate('/'); // ไปหน้าอื่นถ้ามี error
            });

        /*const params = {
            sortMode: sortMode ? 'DESC' : 'ASC',
            mode: mode ? 'postID' : 'avgRating',
            search: searchVal
        };
    
        axios.get("http://localhost:5000/getPost/imgs", { params })
            .then(response => {
                setPostCount(response.data.length);
                setPostImgs(response.data);
            })
            .catch(error => {
                console.error("Error getPost/imgs(handleSearch): ", error);
            });*/

        /*axios.get("http://localhost:5000/getNews")
            .then(response => {
                if (response.data.news) {
                    setNews(response.data.news);
                } else {
                    setNews(null);
                }
            })
            .catch(error => console.error("Error fetching news:", error));*/
    }, []);

    /*const PageNAV = () => {
        const totalPage = Math.ceil(postCount / 20);
    
        const startPage = Math.max(1, currentPage - maxVisitPage);
        const endPage = Math.min(totalPage, currentPage + maxVisitPage);
    
        const changePage = (page) => {
            if (page >= 1 && page <= totalPage) {
                setCurrentPage(page);
            }
        };
    
        return (
            <div className="flex items-center justify-center space-x-2 py-2">
                <button onClick={() => changePage(1)} className="text-black text-lg rounded-full hover:bg-gray-500 w-7 h-7 flex items-center justify-center leading-none">
                    <span className="flex items-center justify-center hover:text-white">{'<<'}</span>
                </button>
    
                <button onClick={() => changePage(currentPage - 1)} className="text-black text-lg rounded-full hover:bg-gray-500 w-7 h-7 flex items-center justify-center leading-none">
                    <span className="flex items-center justify-center hover:text-white">{'<'}</span>
                </button>
    
                {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
                    const page = startPage + index;
                    return (
                        <button key={page} onClick={() => changePage(page)} className={`text-black px-3 py-1 rounded-full ${page === currentPage ? "bg-gray-600 text-white" : "hover:bg-gray-500"}`}>
                            {page}
                        </button>
                    );
                })}
    
                <button onClick={() => changePage(currentPage + 1)} className="black-white text-lg rounded-full hover:bg-gray-500 w-7 h-7 flex items-center justify-center leading-none">
                    <span className="flex items-center justify-center hover:text-white">{'>'}</span>
                </button>
    
                <button onClick={() => changePage(totalPage)} className="black-white text-lg rounded-full hover:bg-gray-500 w-7 h-7 flex items-center justify-center leading-none">
                    <span className="flex items-center justify-center hover:text-white">{'>>'}</span>
                </button>
    
            </div>
        );
    };*/

    /*const Dropdown = () => {
        return (
            <div className="relative inline-block text-left">
                <button onClick={toggleDropdown} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                    {mode ? 'newest' : 'score'}
                </button>
                {isOpen && (
                    <div className="absolute left-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                        <button onClick={handleSetMode} className="block w-full px-4 py-2 text-left hover:bg-gray-200">newest</button>
                        <button onClick={handleSetMode} className="block w-full px-4 py-2 text-left hover:bg-gray-200">score</button>
                    </div>
                )}
            </div>
        )
    };*/

    /*const ShowPosts = () => {
        const column = 4; // จำนวนคอลัมน์ต่อแถว
        const postPerPage = column * 5;
    
        const start = (currentPage - 1) * postPerPage;
        const stop = start + postPerPage - 1;
    
        return (
            <div className=' w-[100%] p-3 border'>
                <div className={`grid grid-cols-4 gap-3 pb-3`}>
                    {Array.isArray(postImgs) && postImgs.length > 0 ? (
                        postImgs.slice(start, stop + 1).map((img, index) => (
                            img ? (
                                <div key={index} className='relative group flex justify-center items-center h-[300px] cursor-pointer'>
                                    <img src={`http://localhost:5000/imgs/${img}`} alt="postImg" className='w-full h-full object-contain transition-transform duration-400 group-hover:scale-[1.25] group-hover:z-10' title={img} />
                                </div>
                            ) : null
                        ))
                    ) : (
                        <p className="text-gray-500">no imgs rn</p>
                    )}
                </div>
                <br />
                <PageNAV postCount={`${postCount}`} maxVisitPage={`${maxVisitPage}`} />
            </div>
        );
    };*/

    /*const Refresh = () => {
        axios.get("http://localhost:5000/getPost/Count")
            .then(response => {
                setPostCount(parseInt(response.data));
            })
            .catch(error => {
                console.error("Error getPost/Count(Refresh): ", error);
            });
    
        axios.get("http://localhost:5000/getPost/imgs")
            .then(response => {
                setPostCount(response.data.length);
                setPostImgs(response.data);
            })
            .catch(error => {
                console.error("Error getPost/imgs(Refresh): ", error);
            });
    };*/

    /*const News = () => {
        const [newFile, setNewFile] = useState(null);
        axios.get("http://localhost:5000/getNews")
            .then(response => {
                if (response.data.news) {
                    setNews(response.data.news);
                } else {
                    setNews(null);
                }
            })
            .catch(error => console.error("Error fetching news:", error));

        const handleDrop = (event) => {
            event.preventDefault();
            const file = event.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
                setNewFile(file);
            }
        };

        const handleConfirm = () => {
            if (!newFile) return;
            const formData = new FormData();
            formData.append("file", newFile);

            axios.post("http://localhost:5000/uploadNews", formData)
                .then(response => {
                    setNews(response.data.filename);
                    setNewFile(null);
                })
                .catch(error => console.error("Error uploading file: ", error));
        };
        return (
            <>
                <div className='flex items-center justify-center w-[80%] h-[400px] mx-auto' onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} >
                    {newFile ? (
                        <div className="text-center  group ">
                            <img src={URL.createObjectURL(newFile)} className='w-full h-[400px] object-cover transition-transform duration-1000 group-hover:scale-[1.1]' alt="New File" />
                        </div>
                    ) : news ? (
                        <div className='text-center group'>
                            <img src={`http://localhost:5000/news/${news}`} className='w-full h-[400px] object-cover transition-transform duration-1000 group-hover:scale-[1.1]' alt="News" />
                        </div>
                    ) : (
                        <p className="text-white">no news rn</p>
                    )}
                </div>
                {newFile && (
                    <div className="mt-2 mx-auto flex items-center justify-center">
                        <button className="bg-red-500 text-white px-4 py-2 m-2" onClick={() => setNewFile(null)}>Cancel</button>
                        <button className="bg-green-500 text-white px-4 py-2 m-2" onClick={handleConfirm}>Confirm</button>
                    </div>
                )}
            </>
        );
    };*/

    return (
        <div className="min-h-screen bg-bgColor">
            <h1>{role ? role.roleID : "Loading..."}</h1>
            {/*{isAdding && <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center bg-blue-300 p-4 border-4 w-[80%] h-[90vh] overflow-y-auto mx-auto rounded-lg z-50'>

                <div {...getRootProps()} className='flex flex-col justify-center items-center bg bg-red-300 w-[60%] min-h-[500px] border-2 border-dashed border-gray-500 p-4 cursor-pointer'>
                    <input {...getInputProps()} />
                    {isDragActive ?
                        <p className="mb-4 font-bold">Drop the files here ...</p> : <p className="mb-4 font-bold">Drag & drop your picture here</p>
                    }
                    {file && (
                        <div className='relative  flex justify-center items-center w-full h-full'>
                            <button onClick={handleClearFile} className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white text-lg font-bold rounded-full flex items-center justify-center shadow-md hover:bg-red-700">
                                X
                            </button>
                            <img src={file.preview} alt="Uploaded Preview" className='bg-blue-200 max-w-[300px] max-h-[300px] block p-3 border-3 border-black border-dashed' />
                        </div>
                    )}
                </div>

                {errorMessage && (
                    <div className='text-red-500 text-[20px] mt-4 font-semibold cursor-default'>
                        {errorMessage}
                    </div>
                )}

                <div className='flex flex-col items-center bg-grey-300 bg-clip-padding p-3 w-full'>
                    {/* input post ชื่อ
                    <div className="relative w-full max-w-lg">
                        <textarea value={title} onChange={handleTitle} placeholder='Enter your post name' className='w-full p-2 border rounded-md resize-none h-[80px] overflow-y-auto mt-3' />
                        {title && (
                            <button onClick={() => setTitle("")} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white text-lg font-bold rounded-full flex items-center justify-center shadow-md hover:bg-red-700">
                                X
                            </button>
                        )}
                    </div>
                    <br />

                    {/* input post description
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
                            <button onClick={handleCancle} className='px-4 py-2 bg-red-500 text-white rounded block my-2'>
                                cancle
                            </button>
                        </div>

                        <div className='w-full flex justify-center'>
                            <button onClick={handleUpload} className='px-4 py-2 bg-blue-500 text-white rounded block my-2'>
                                confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div >}*/}
            <br /><br />

            <News role={role} />
            <ShowPosts userId={state.userId} role={role} />
            {/*<ProfileShowPost userId={state.userId} />*/}

            {/*}            
            <div className='relative w-[90%] mx-auto mt-8'>
                <div className='absolute top-0 left-0'>
                    <button onClick={handleIsAdding} className='border-2'> add img </button>
                </div>
                <div className='absolute top-0 right-0'>

                    <Dropdown />

                    <button className='bg-blue-400 rounded-2xl p-2.5 ml-2' onClick={handleSortMode}>
                        Sort
                    </button>

                    <input type="text" value={searchVal} onChange={handleSearchVal} placeholder="type for search here..." className="bg-white border-2 border-black focus:ring-2 focus:ring-gray-950 focus:outline-none rounded-2xl p-2.5 ml-2" />

                    <button className='bg-blue-400 rounded-2xl p-2.5 ml-2 ' onClick={handleSearch}>
                        Search
                    </button>

                </div>

                <br /><br /><br />
                <profileShowPost postCount={postCount} postImgs={postImgs} />

            </div>*/}

            <br />
        </div >
    );
}


export default Main;