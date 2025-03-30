import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import Popup from "reactjs-popup";

const PostDetail = () => {
    const [id, setId] = useState(null);
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(null);
    const [open, setOpen] = useState(false);
    const [userID, setUserID] = useState(null);
    const [role, setRole] = useState(null);
    const [storedUserID, setStoredUserID] = useState(null);

    const location = useLocation();
    const { state } = location;

    useEffect(() => {
        setStoredUserID(state.userId);
        if (state.postId === undefined && state.postId === null) {
            setId(0);
        }
        else {
            setId(state.postId);
        }
        setUserID(storedUserID);
        const fetchData = async () => {
            try {
                if (storedUserID) {
                    const roleRes = await axios.get("http://localhost:5000/getRole", {
                        params: { userId: storedUserID }
                    });
                    setRole(roleRes.data.roleID);
                }

                const postURL = storedUserID
                    ? `http://localhost:5000/getPost/${id}/${storedUserID}`
                    : `http://localhost:5000/getPost/${id}`;
                const postRes = await axios.get(postURL);
                setPost(postRes.data);
                setRating(postRes.data.userRating || 0);

                const commentRes = await axios.get(`http://localhost:5000/getComment/${id}`);
                setComments(commentRes.data);
            } catch (error) {
                console.error("Error fetching post/comments:", error);
            }
        };

        fetchData();
    }, [id]);

    const handleOpenPopup = () => {
        if (!userID) {
            navigate("/login");
        } else {
            setOpen(true);
        }
    };

    const handleCommentSubmit = () => {
        const data = {
            postID: id,
            commentDescription: newComment,
            ratingValue: rating,
            userID: userID,
        };

        axios.post(`http://localhost:5000/addComment`, data)
            .then(() => {
                setNewComment("");
                setOpen(false);
                axios.get(`http://localhost:5000/getPost/${id}/${userID}`)
                    .then(response => {
                        setPost(response.data);
                        setRating(response.data.userRating || null);
                    });
                axios.get(`http://localhost:5000/getComment/${id}`)
                    .then(response => setComments(response.data));
            });
    };

    {/*ส่วนของscroll comment ไปล่างสุด */ }
    const commentsRef = useRef(null);
    const scrollToBottom = () => {
        if (commentsRef.current) {
            commentsRef.current.scrollTop = commentsRef.current.scrollHeight;
        }
    };
    useEffect(() => {
        scrollToBottom();
    }, [comments]);

    if (!post) return <h2>Loading...</h2>;

    return (
        <div className="page">
            <button className="back-arrow" onClick={() => navigate(-1)}>←</button>

            <div className="post-container">
                {/*ส่วนของโพสต์ */}
                <div className="post-left">
                    <div className="post-header">
                        <Link to={`/profile/${post.userID}`} className="post-profile-pic-Link">
                            <img className="post-profile-pic" src={post.profilePic ? `http://localhost:5000/profilePicture/${post.profilePic}` : `http://localhost:5000/imgs/def-pic.jpg`} />
                        </Link>
                        <Link to={`/profile/${post.userID}`} className="post-username-Link">
                            <span className="post-username">{post.userName}</span>
                        </Link>
                    </div>
                    <img className="post-image" src={`http://localhost:5000/imgs/${post.photoPath}`} alt={post.postName} />
                    <div className="cursor-default"><strong>PictureName:</strong> {post.postName ? post.postName : "-"}</div>
                    <div className="post-description"><strong>Description:</strong> {post.postDescription ? post.postDescription : "-"}</div>
                </div>

                {/*ส่วนของคอมเมนต์ */}
                <div className="post-right">
                    <div className="comment-header">
                        <div className="comment-header">
                            <h2 className="cursor-default">Comments</h2>
                            <div className="rating-container">
                                <span className="acursor-default cursor-default">
                                    ⭐ {post.avgRating && !isNaN(post.avgRating) ? parseFloat(post.avgRating).toFixed(2) : "N/A"}
                                    <span style={{ fontSize: "0.85rem", color: "#333", marginLeft: "5px", cursor: "default" }}>
                                        ({post.ratingCount || 0} reviews)
                                    </span>
                                </span>

                                {userID && post.userRating !== null && (
                                    <span className="cursor-default">Your Rating: {post.userRating} ⭐</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <ul className="comments-list" ref={commentsRef}>
                        {comments.map((comment, index) => (
                            <li key={index} className="comment-item">
                                <div className="comment-content">
                                    {/* Profile Picture ของผู้ใช้คอมเมนต์ */}
                                    <Link to={`/profile/${comment.userID}`} className="comment-pic-Link">
                                        <img className="comment-profile-pic" src={`http://localhost:5000/profilePicture/${comment.profilePic || "def-pic.jpg"}`} alt="Profile" />
                                    </Link>
                                    {/* กล่องคอมเมนต์ */}
                                    <div className="comment-text-box">
                                        <div className="cursor-default">
                                            <Link to={`/profile/${comment.userID}`} className="comment-user-Link">
                                                <strong className="comment-user">{comment.userName}</strong>
                                            </Link>
                                            <span className="comment-time">{new Date(comment.commentTime).toLocaleString()}</span>
                                        </div>
                                        <div style={{ whiteSpace: 'pre-wrap' }}>
                                            {comment.commentDescription}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {/* แสดงปุ่มหรือข้อความขึ้นอยู่กับสถานะ login */}
                    {userID && [1, 2, 3].includes(role) ? (
                        <button className="comment-btn" onClick={handleOpenPopup}>Give Feedback</button>
                    ) : (
                        <p className="login-message">
                            Please <Link to="/login" className="login-link">Login</Link> first
                        </p>
                    )}
                    {/* Popup แบบ Rating หรือ Comment */}
                    <Popup open={open} closeOnDocumentClick onClose={() => setOpen(false)} modal nested>
                        <div className="popup-container">
                            <h3 className="popup-title">Rate or Comment</h3>

                            {/* เลือก Rating (ไม่บังคับ) */}
                            <label className="popup-label">Rating (Optional):</label>
                            <select className="popup-select" value={rating || ""} onChange={(e) => setRating(e.target.value ? parseInt(e.target.value) : null)}                            >
                                <option value="">Select rating</option>
                                <option value="1">⭐ 1 star</option>
                                <option value="2">⭐⭐ 2 stars</option>
                                <option value="3">⭐⭐⭐ 3 stars</option>
                                <option value="4">⭐⭐⭐⭐ 4 stars</option>
                                <option value="5">⭐⭐⭐⭐⭐ 5 stars</option>
                            </select>

                            {/* Input สำหรับ Comment (ไม่บังคับ) */}
                            <label className="popup-label">Feedback (Optional):</label>
                            <textarea
                                className="popup-textarea"
                                placeholder="Write your comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                maxLength={800}
                            />
                            <p style={{ textAlign: "right", fontSize: "0.9rem", color: "#666", cursor: "default" }}>
                                {newComment.length}/800 characters
                            </p>

                            <button className="popup-btn" onClick={handleCommentSubmit}>Submit</button>
                        </div>
                    </Popup>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;