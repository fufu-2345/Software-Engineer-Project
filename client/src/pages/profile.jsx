import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import ProfileShowPost from './components/profileShowPost';

function Profile() {
    const location = useLocation();
    const { state } = location;

    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        accName: '',
        accDescription: '',
        Instagram: '',
        Line: '',
        X: '',
        Phone: '',
        Other: '',
        profilePic: '',
    });
    const [profileImage, setProfileImage] = useState(null);
    const [userId, setUserId] = useState(null); // เพิ่ม state สำหรับเก็บ userID

    // ดึง userID จาก localStorage เมื่อ component โหลด
    useEffect(() => {/*
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            const user = JSON.parse(loggedInUser);
            setUserId(user.userID); // ตั้งค่า userID จากข้อมูลการล็อกอิน
        }*/

        if (state) {
            setUserId(state.userId);
            console.log(userId);
        }
        else {
            console.log("cant get state / useEffect err");
        }
    }, []);

    // ดึงข้อมูลโปรไฟล์ผู้ใช้เมื่อ userID เปลี่ยน
    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:5000/getUserProfile/${userId}`)
                .then(response => response.json())
                .then(data => setFormData(data))
                .catch(error => console.error('Error fetching profile:', error));
        }
    }, [userId]);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file); // เก็บไฟล์รูปภาพที่เลือก
    };

    const handleSave = () => {
        const formDataWithImage = new FormData();
        formDataWithImage.append('userId', userId);
        formDataWithImage.append('accName', formData.accName);
        formDataWithImage.append('accDescription', formData.accDescription);
        formDataWithImage.append('Instagram', formData.Instagram);
        formDataWithImage.append('Line', formData.Line);
        formDataWithImage.append('X', formData.X);
        formDataWithImage.append('Phone', formData.Phone);
        formDataWithImage.append('Other', formData.Other);
        if (profileImage) {
            formDataWithImage.append('image', profileImage); // ส่งรูปภาพ
        }

        fetch('http://localhost:5000/updateProfile', {
            method: 'POST',
            body: formDataWithImage,
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message || 'Failed to update profile');
                if (data.message) {
                    setShow(false);
                    // โหลดข้อมูลใหม่หลังจากอัปเดต
                    fetch(`http://localhost:5000/getUserProfile/${userId}`)
                        .then(response => response.json())
                        .then(data => setFormData(data))
                        .catch(error => console.error('Error fetching profile:', error));
                }
            })
            .catch(error => alert('Error updating profile: ' + error));
    };

    return (
        <Container className='pagePro'>
            <Row className="pro_r1">
                <Col sm={7}>
                    <Image
                        className="pro_main"
                        src={formData.profilePic ? `http://localhost:5000/uploads/${formData.profilePic}` : `https://localhost:5000/uploads/standard.png`}
                        roundedCircle
                        onClick={handleShow}
                        style={{ cursor: 'pointer' }}
                    />
                </Col>
                <Col sm={5} className="pro_contract">
                    <div className="contact-row">
                        <div className="contract_head">Instagram:</div>
                        <div className="contract_box">{formData.Instagram}</div>
                    </div>
                    <div className="contact-row">
                        <div className="contract_head">Line:</div>
                        <div className="contract_box">{formData.Line}</div>
                    </div>
                    <div className="contact-row">
                        <div className="contract_head">X:</div>
                        <div className="contract_box">{formData.X}</div>
                    </div>
                </Col>
            </Row>
            <Row className="pro_r2">
                <Col className="pro_contract">
                    <div className="contact-row">
                        <div className="contract_head">Name:</div>
                        <div className="contract_box">{formData.accName}</div>
                    </div>
                </Col>
                <Col className="pro_contract">
                    <div className="contact-row">
                        <div className="contract_head">About Me:</div>
                        <div className="contract_box">{formData.accDescription}</div>
                    </div>
                </Col>
            </Row>

            <Row className="pro_r3">
                <div>Other</div>
                <div className="pro_des">{formData.Other}</div>
            </Row>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {['accName', 'accDescription', 'Instagram', 'Line', 'X', 'Phone', 'Other'].map((field) => (
                            <Form.Group controlId={`form${field}`} className="mt-3" key={field}>
                                <Form.Label>{field.replace(/([A-Z])/g, ' $1').toUpperCase()}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        ))}
                        <Form.Group controlId="formImage" className="mt-3">
                            <Form.Label>Profile Image</Form.Label>
                            <Form.Control
                                type="file"
                                name="image"
                                onChange={handleImageChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={handleSave}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
            <br /><br />
            <ProfileShowPost userId={userId} />
        </Container>
    );
}

export default Profile;