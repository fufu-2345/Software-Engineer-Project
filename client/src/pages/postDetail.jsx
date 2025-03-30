import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import Popup from "reactjs-popup";
import Nav from '../components/navbar';

const PostDetail = () => {
    const [id, setId] = useState(null);
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(null);
    const [open, setOpen] = useState(false);
    const [userID, setUserID] = useState(null);
    const [role, setRole] = useState(0);
    const [storedUserID, setStoredUserID] = useState(null);
    const [showFullDesc, setShowFullDesc] = useState(false);
    const [descTooLong, setDescTooLong] = useState(false);
    const descriptionRef = React.useRef();
    const postLeftRef = useRef(null);
    const [commentMaxHeight, setCommentMaxHeight] = useState(null);



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
        setUserID(state.userId);
        const fetchData = async () => {
            try {
                if (storedUserID) {
                    const roleRes = await axios.get("http://localhost:5000/getRole", {
                        params: { userId: storedUserID }
                    });
                    setRole(roleRes.data.roleID);
                }
                const postURL = state.userId
                    ? `http://localhost:5000/getPost/${state.postId}/${state.userId}`
                    : `http://localhost:5000/getPost/${state.postId}`;
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

    const goProfile = () => {
        let loggedInUser;
        const params = {
            id: id
        };
        axios.get(`http://localhost:5000/getUserid`, { params })
            .then(response => {
                loggedInUser = response.data.userID;
                navigate('/profile', { state: { userId: userID, loggedInUser: loggedInUser } });
            })
            .catch(error => {
                console.error("Error getPost/imgs(handleSearch): ", error);
            });
    };

    const goProfile2 = (index) => {
        let loggedInUser;
        const params = {
            id: id
        };
        axios.get(`http://localhost:5000/getUserid`, { params })
            .then(response => {
                loggedInUser = response.data.userID;
                console.log(userID, comments.userID)
                navigate('/profile', { state: { userId: userID, loggedInUser: comments[index].userID } });
            })
            .catch(error => {
                console.error("Error getPost/imgs(handleSearch): ", error);
            });
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

    const handleToggleDescription = () => {
        const newState = !showFullDesc;
        setShowFullDesc(newState);

        setTimeout(() => {
            if (newState && postLeftRef.current) {
                const height = postLeftRef.current.offsetHeight;
                setCommentMaxHeight(height);
            } else {
                // ย่อกลับมา default
                setCommentMaxHeight(null);
            }
        }, 200);
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

    useEffect(() => {
        if (descriptionRef.current) {
            const lineHeight = parseFloat(getComputedStyle(descriptionRef.current).lineHeight);
            const maxLines = 6;
            const maxHeight = lineHeight * maxLines;
            if (descriptionRef.current.scrollHeight > maxHeight) {
                setDescTooLong(true);
            }
        }
    }, [post]);

    if (!post) return <h2>Loading...</h2>;

    return (
        <div className="page">
            {role !== 0 ? <Nav userID={userID} /> : <Nav userID={null} />}
            <button className="back-arrow" onClick={() => navigate(-1)}>←</button>

            <div className="post-container">
                {/*ส่วนของโพสต์ */}
                <div className="post-left" ref={postLeftRef}>
                    <div className="post-header">
                        <div className="post-profile-pic-Link" onClick={goProfile}>
                            <img className="post-profile-pic" src={post.profilePic ? `http://localhost:5000/profilePicture/${post.profilePic}` : `http://localhost:5000/imgs/def-pic.jpg`} />
                        </div>
                        <div className="post-username-Link" onClick={goProfile}>
                            <span className="cursor-pointer text-2xl font-bold text-[#333333]">{post.userName}</span>
                        </div>
                    </div>

                    <img className="post-image" src={`http://localhost:5000/imgs/${post.photoPath}`} alt={post.postName} />
                    <div className="cursor-default"><strong>PictureName:</strong> {post.postName ? post.postName : "-"}</div>
                    <div ref={descriptionRef} className={`post-description ${showFullDesc ? "" : "collapsed"}`}>
                        {post.postDescription || "-"}
                    </div>

                    {descTooLong && (
                        <button onClick={handleToggleDescription} className="read-more-btn">
                            {showFullDesc ? "-Read less-" : "-Read more-"}
                        </button>
                    )}


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
                    <ul className="comments-list" ref={commentsRef} style={commentMaxHeight ? { maxHeight: `${commentMaxHeight}px` } : {}}>
                        {comments.map((comment, index) => (
                            <li key={index} className="comment-item">
                                <div className="comment-content">
                                    {/* Profile Picture ของผู้ใช้คอมเมนต์ */}
                                    <div className="no-underline cursor-pointer" onClick={()=> goProfile2(index)}>
                                        <img className="comment-profile-pic" src={`http://localhost:5000/profilePicture/${comment.profilePic || "def-pic.jpg"}`} alt="Profile" />
                                    </div>
                                    {/* กล่องคอมเมนต์ */}
                                    <div className="comment-text-box">
                                        <strong className="no-underline cursor-pointer text-base font-bold text-[#333] transition-all duration-300 hover:text-shadow-lg hover:text-[1.05rem]" onClick={()=> goProfile2(index)}>{comment.userName}</strong>
                                        <span className="cursor-default text-xs font-normal text-[#888] italic float-right">{new Date(comment.commentTime).toLocaleString()}</span>
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