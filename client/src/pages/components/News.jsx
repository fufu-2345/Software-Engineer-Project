import React, { useState, useEffect } from 'react';
import axios from 'axios';

const News = ({ role }) => {
    const [newFile, setNewFile] = useState(null);
    const [news, setNews] = useState(null);

    const handleDrop = (event) => {
        event.preventDefault();
        if (role.roleID !== 1) return;

        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setNewFile(file);
        }
    };

    const handleConfirm = () => {
        if (role.roleID !== 1 || !newFile) return;

        const formData = new FormData();
        formData.append("file", newFile);

        axios.post("http://localhost:5000/uploadNews", formData)
            .then(response => {
                setNews(response.data.filename);
                setNewFile(null);
            })
            .catch(error => console.error("Error uploading file: ", error));
    };

    useEffect(() => {
        axios.get("http://localhost:5000/getNews")
            .then(response => {
                if (response.data.news) {
                    setNews(response.data.news);
                } else {
                    setNews(null);
                }
            })
            .catch(error => console.error("Error fetching news:", error));
    }, []);

    return (
        <>
            <div className='flex items-center justify-center w-[80%] h-[400px] mx-auto'
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop} >
                {newFile ? (
                    <div className="text-center group">
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
            {newFile && role.roleID === 1 && ( // แสดงปุ่มเฉพาะเมื่อ role เป็น 1
                <div className="mt-2 mx-auto flex items-center justify-center">
                    <button className="bg-red-500 text-white px-4 py-2 m-2" onClick={() => setNewFile(null)}>Cancel</button>
                    <button className="bg-green-500 text-white px-4 py-2 m-2" onClick={handleConfirm}>Confirm</button>
                </div>
            )}
        </>
    );
};

export default News;