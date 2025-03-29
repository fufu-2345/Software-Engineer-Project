import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import axios from "axios";
import Popup from "reactjs-popup";

const PostDetail = () => {
    // id=postID
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(null);
    const [open, setOpen] = useState(false);
    const [userID, setUserID] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        // storedUserID = userID คนดู
        const storedUserID = localStorage.getItem("userID");
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
        if (!newComment.trim() && rating === null) {
            alert(" Please provide either a rating or a comment!");
            return;
        }

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

                // โหลดข้อมูลใหม่หลังจากให้คอมเมนต์หรือให้คะแนน
                axios.get(`http://localhost:5000/getPost/${id}/${userID}`)
                    .then(response => {
                        setPost(response.data);
                        setRating(response.data.userRating || null);
                    })
                axios.get(`http://localhost:5000/getComment/${id}`)
                    .then(response => setComments(response.data))
            })
    };

    if (!post) return <h2>Loading...</h2>;

    return (
        <div className="post-container">
            {/*ส่วนของโพสต์ */}
            <div className="post-left">
                <div className="post-header">
                    <Link to={`/profile/${post.userID}`} className="post-profile-pic-Link">
                        <img className="post-profile-pic" src={post.profilePic ? `http://localhost:5000/imgs/${post.profilePic}` : "http://localhost:5000/imgs/def-pic.jpg"} alt="Profile" />
                    </Link>
                    <Link to={`/profile/${post.userID}`} className="post-username-Link">
                        <span className="post-username">{post.userName}</span>
                    </Link>
                </div>
                <img className="post-image" src={`http://localhost:5000/imgs/${post.photoPath}`} alt={post.postName} />
                <div className="post-description">{post.postDescription}</div>
            </div>

            {/*ส่วนของคอมเมนต์ */}
            <div className="post-right">
                <div className="comment-header">
                    <div className="comment-header">
                        <h2 className="head-comment">Comments</h2>
                        <div className="rating-container">
                            <span className="avg-rating">
                                ⭐ {post.avgRating && !isNaN(post.avgRating) ? parseFloat(post.avgRating).toFixed(2) : "N/A"}
                                <span style={{ fontSize: "0.85rem", color: "#333", marginLeft: "5px" }}>
                                    ({post.ratingCount || 0} reviews)
                                </span>
                            </span>

                            {userID && post.userRating !== null && (
                                <span className="user-rating">Your Rating: {post.userRating} ⭐</span>
                            )}
                        </div>
                    </div>
                </div>
                <ul className="comments-list">
                    {comments.map((comment, index) => (
                        <li key={index} className="comment-item">
                            <div className="comment-content">
                                {/* Profile Picture ของผู้ใช้คอมเมนต์ */}
                                <Link to={`/profile/${comment.userID}`} className="comment-pic-Link">
                                    <img className="comment-profile-pic" src={`http://localhost:5000/imgs/${comment.profilePic || "def-pic.jpg"}`} alt="Profile" />
                                </Link>
                                {/* กล่องคอมเมนต์ */}
                                <div className="comment-text-box">
                                    <div className="comment-user-time">
                                        <Link to={`/profile/${comment.userID}`} className="comment-user-Link">
                                            <strong className="comment-user">{comment.userName}</strong>
                                        </Link>
                                        <span className="comment-time">{new Date(comment.commentTime).toLocaleString()}</span>
                                    </div>
                                    {comment.commentDescription}
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
                        <p style={{ textAlign: "right", fontSize: "0.9rem", color: "#666" }}>
                            {newComment.length}/800 characters
                        </p>

                        <button className="popup-btn" onClick={handleCommentSubmit}>Submit</button>
                    </div>
                </Popup>
            </div>
        </div>
    );
};

export default PostDetail;