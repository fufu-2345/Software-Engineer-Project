import React, { useState } from 'react';

const ShowPost = ({ postCount, postImgs }) => {
    const [currentPage, setCurrentPage] = useState(1);

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

    return (




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


    );
};

export default ShowPost;