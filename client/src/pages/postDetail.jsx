import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


const PostDetail = () => {
    const post = {
      title: "what is a pig",
      image: "https://i.ytimg.com/vi/3WAOxKOmR90/mqdefault.jpg",
      description: "Test_description",
      comments: [
        { id: 1, username: "Test1", text: "www" },
        { id: 2, username: "Test2", text: "wwww" },
        { id: 2, username: "Test3", text: "wwwww" },
      ],
    };
    
    return (
        <>
        <div className="post-detail-container">
            {/* ซ้าย: เนื้อหาโพสต์ */}
            <div className="post-left">
                <h1 className="post-title">{post.title}</h1>
                <img className="post-image" src={post.image} alt={post.title} />
                <p className="post-description">{post.description}</p>
            </div>

            {/* ขวา: คอมเมนต์ */}
            <div className="post-right">
                <h2 className='Head-comment'>Comments</h2>
                <ul className="comments-list">
                    {post.comments.map((comment) => (
                    <li key={comment.id} className="comment-item">
                        <strong>{comment.username}:</strong> {comment.text}
                    </li>
                    ))}
                </ul>
            </div>
        </div>
        </>
    );
    
}

export default PostDetail;