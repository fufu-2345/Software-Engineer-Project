import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Form, Image } from "react-bootstrap";

const Profile = ({ userId }) => {
    const [formData, setFormData] = useState({
        accName: "",
        accDescription: "",
        Instagram: "",
        X: "",
        Line: "",
        Phone: "",
        Other: "",
        profilePic: "",
    });

    const [show, setShow] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/profile/${userId}`)
            .then(response => {
                setFormData(response.data);
            })
            .catch(error => console.error("Error fetching profile:", error));
    }, [userId]);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loggedInUser = JSON.parse(localStorage.getItem("user"));

        if (!loggedInUser || loggedInUser.userID !== userId) {
            alert("Unauthorized: Cannot edit this profile.");
            return;
        }

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });

        if (selectedImage) {
            formDataToSend.append("image", selectedImage);
        }

        formDataToSend.append("userId", userId);

        try {
            const response = await axios.post("http://localhost:5000/updateProfile", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data", userId: loggedInUser.userID }
            });
            alert(response.data.message);
            handleClose();
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const isOwner = loggedInUser && loggedInUser.userID === userId;

    return (
        <div className="profile-container">
            <h2>Profile</h2>
            {isOwner && (
                <Image
                    className="pro_main"
                    src={formData.profilePic ? `http://localhost:5000/uploads/${formData.profilePic}` : `http://localhost:5000/uploads/standard.png`}
                    roundedCircle
                    onClick={handleShow}
                    style={{ cursor: "pointer" }}
                />
            )}
            <p><strong>Name:</strong> {formData.accName}</p>
            <p><strong>Description:</strong> {formData.accDescription}</p>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="accName" value={formData.accName} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" name="accDescription" value={formData.accDescription} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Profile Picture</Form.Label>
                            <Form.Control type="file" onChange={handleImageChange} />
                        </Form.Group>

                        <Button variant="primary" type="submit">Save Changes</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Profile;