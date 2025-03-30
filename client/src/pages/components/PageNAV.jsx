import React, { useState } from 'react';

const PageNAV = ({ currentPage, postCount, maxVisitPage }) => {
    constant[currentPage, setCurrentPage] = useState(1);
    const totalPage = Math.ceil(postCount / 20);
    const startPage = Math.max(1, currentPage - Math.floor(maxVisitPage));
    const endPage = Math.min(totalPage, currentPage + Math.floor(maxVisitPage));

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

            <button onClick={() => changePage(currentPage + 1)} className="text-black text-lg rounded-full hover:bg-gray-500 w-7 h-7 flex items-center justify-center leading-none">
                <span className="flex items-center justify-center hover:text-white">{'>'}</span>
            </button>

            <button onClick={() => changePage(totalPage)} className="text-black text-lg rounded-full hover:bg-gray-500 w-7 h-7 flex items-center justify-center leading-none">
                <span className="flex items-center justify-center hover:text-white">{'>>'}</span>
            </button>
        </div>
    );
};

export default PageNAV;
