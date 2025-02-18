import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileShowPost = ({ userId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [postCount, setPostCount] = useState(0);
    const [postImgs, setPostImgs] = useState([]);
    const [searchVal, setSearchVal] = useState("");
    const [mode, setMode] = useState(true);
    const [sortMode, setSortMode] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const maxVisitPage = 5;
    const column = 4; // จำนวนคอลัมน์ต่อแถว
    const postPerPage = column * 5;
    const start = (currentPage - 1) * postPerPage;
    const stop = start + postPerPage - 1;

    const totalPage = Math.ceil(postCount / 20);
    const startPage = Math.max(1, currentPage - Math.floor(maxVisitPage));
    const endPage = Math.min(totalPage, currentPage + Math.floor(maxVisitPage));

    const changePage = (page) => {
        if (page >= 1 && page <= totalPage) {
            setCurrentPage(page);
        }
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSetMode = () => {
        setIsOpen(false);
        setMode(!mode);
    };

    const handleSearch = () => {
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
    };

    const handleSearchVal = (event) => {
        setSearchVal(event.target.value);
    };

    const handleSortMode = () => {
        setSortMode(!sortMode);
    };

    const Dropdown = () => {
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
    };

    useEffect(() => {
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
    }, []);

    return (
        <div className='relative w-[90%] mx-auto mt-8'>
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
            <div className=' w-[100%] p-3 border'>
                <div className={`grid grid-cols-4 gap-3 pb-3`}>
                    {Array.isArray(postImgs) && postImgs.length > 0 ? (
                        postImgs.slice(start, stop + 1).map((img, index) => (
                            img ? (
                                <div key={index} className='relative group flex justify-center items-center h-[300px] cursor-pointer'>
                                    <img src={`http://localhost:5000/imgs/${img}`} alt="postImg" className='w-full h-full object-contain transition-transform duration-400 group-hover:scale-[1.25] group-hover:z-10' title={img} />
                                </div>
                            ) : null < img

                        ))
                    ) : (
                        <p className="text-gray-500">no imgs rn</p>
                    )}
                </div>
                <br />

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

                    <button onClick={() => changePage(currentPage + 1)} className="text-black text-lg rounded-full hover:bg-gray-500 w-7 h-7 flex items-center justify-center leading-none">
                        <span className="flex items-center justify-center hover:text-white">{'>'}</span>
                    </button>

                    <button onClick={() => changePage(totalPage)} className="text-black text-lg rounded-full hover:bg-gray-500 w-7 h-7 flex items-center justify-center leading-none">
                        <span className="flex items-center justify-center hover:text-white">{'>>'}</span>
                    </button>
                </div>

            </div>




        </div>

    );
};

export default ProfileShowPost;