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
    const [tempFormData, setTempFormData] = useState({ ...formData }); // state สำรอง
    const [profileImage, setProfileImage] = useState(null);
    const [userId, setUserId] = useState(1);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            const user = JSON.parse(loggedInUser);
            setUserId(user.userID);
        }
    }, []);

    useEffect(() => {
        if (state) {
            setUserId(state.userId);
            console.log(userId);
        }
        else {
            console.log("cant get state / useEffect err");
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:5000/getUserProfile/${userId}`)
                .then(response => response.json())
                .then(data => {
                    setFormData(data);
                    setTempFormData(data); // ตั้งค่า state สำรองให้ตรงกับข้อมูลปัจจุบัน
                })
                .catch(error => console.error('Error fetching profile:', error));
        }
    }, [userId]);

    const handleShow = () => {
        setTempFormData({ ...formData }); // รีเซ็ต tempFormData ทุกครั้งที่เปิด Modal
        setShow(true);
    };

    const handleClose = () => setShow(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTempFormData({ ...tempFormData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
    };

    const handleSave = () => {
        const formDataWithImage = new FormData();
        formDataWithImage.append('userId', userId);
        formDataWithImage.append('accName', tempFormData.accName || '');
        formDataWithImage.append('accDescription', tempFormData.accDescription || '');
        formDataWithImage.append('Instagram', tempFormData.Instagram || '');
        formDataWithImage.append('Line', tempFormData.Line || '');
        formDataWithImage.append('X', tempFormData.X || '');
        formDataWithImage.append('Phone', tempFormData.Phone || '');
        formDataWithImage.append('Other', tempFormData.Other || '');
        if (profileImage) {
            formDataWithImage.append('image', profileImage);
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
                    window.location.reload(); // รีเฟรชหน้า Profile
                }
            })
            .catch(error => alert('Error updating profile: ' + error));
    };

    return (
        <Container className='pagePro'>
            <Row className="pro_r1">
                <Col sm={7}>

                {userId === state?.userId && ( 
                    <Image
                        className="pro_main"
                        src={formData.profilePic ? `http://localhost:5000/uploads/${formData.profilePic}` : `http://localhost:5000/uploads/standard.png`}
                        roundedCircle
                        onClick={handleShow}
                        style={{ cursor: 'pointer' }}
                    />
                )}

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

            {/* Modal แก้ไขข้อมูล */}
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
                                    value={tempFormData[field]}
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
            <ProfileShowPost userId={userId} />
        </Container>
    );
}

export default Profile;