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
    const [tempFormData, setTempFormData] = useState({ ...formData });
    const [profileImage, setProfileImage] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    //loggedInUser= iduser ของ profile 
    //userid=id คนดู
    useEffect(() => {
        const loggedInUser = state.loggedInUser;
        setUserId(loggedInUser);
        if (state.userIdrId !== null && state.userId !== undefined && loggedInUser !== null && loggedInUser !== undefined) {
            if (state.loggedInUser === state.userId) {
                setIsOwner(true);
            }
            fetch(`http://localhost:5000/getUserProfile/${state.loggedInUser}`)
                .then(response => response.json())
                .then(data => {
                    setFormData(data);
                    setTempFormData(data);
                })
                .catch(error => console.error('Error fetching profile:', error));
        }
    }, [state]);

    const handleShow = () => {
        if (isOwner) {
            setTempFormData({ ...formData });
            setShow(true);
        }
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
        Object.entries(tempFormData).forEach(([key, value]) => {
            formDataWithImage.append(key, value || '');
        });
        if (profileImage) {
            formDataWithImage.append('image', profileImage);
        }

        fetch('http://localhost:5000/updateProfile', {
            method: 'POST',
            body: formDataWithImage,
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    console.log('Profile updated:', data.message); // Debug log
                    setShow(false);
                    setFormData(tempFormData);
                    setProfileImage(null);
                    window.location.reload();
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
                        src={formData.profilePic ? `http://localhost:5000/uploads/${formData.profilePic}` : `http://localhost:5000/uploads/standard.png`}
                        roundedCircle
                        onClick={isOwner ? handleShow : undefined}
                        style={{ cursor: isOwner ? 'pointer' : 'default' }}
                    />
                </Col>
                <Col sm={5} className="pro_contract">
                    <div className="contact-row"><div className="contract_head">Instagram:</div><div className="contract_box">{formData.Instagram}</div></div>
                    <div className="contact-row"><div className="contract_head">Line:</div><div className="contract_box">{formData.Line}</div></div>
                    <div className="contact-row"><div className="contract_head">X:</div><div className="contract_box">{formData.X}</div></div>
                </Col>
            </Row>
            <Row className="pro_r2">
                <Col className="pro_contract"><div className="contact-row"><div className="contract_head">Name:</div><div className="contract_box">{formData.accName}</div></div></Col>
                <Col className="pro_contract"><div className="contact-row"><div className="contract_head">About Me:</div><div className="contract_box">{formData.accDescription}</div></div></Col>
            </Row>
            <Row className="pro_r3"><div>Other</div><div className="pro_des">{formData.Other}</div></Row>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton><Modal.Title>Edit Profile</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        {['accName', 'accDescription', 'Instagram', 'Line', 'X', 'Phone', 'Other'].map((field) => (
                            <Form.Group controlId={`form${field}`} className="mt-3" key={field}>
                                <Form.Label>{field.replace(/([A-Z])/g, ' $1').toUpperCase()}</Form.Label>
                                <Form.Control type="text" name={field} value={tempFormData[field]} onChange={handleChange} />
                            </Form.Group>
                        ))}
                        <Form.Group controlId="formImage" className="mt-3">
                            <Form.Label>Profile Image</Form.Label>
                            <Form.Control type="file" name="image" onChange={handleImageChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                {isOwner && (
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                        <Button variant="primary" onClick={handleSave}>Save Changes</Button>
                    </Modal.Footer>
                )}
            </Modal>
            <ProfileShowPost userId={userId} />
        </Container>
    );
}

export default Profile;