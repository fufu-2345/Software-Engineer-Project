import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';


function Profile(){
    return(
    <Container>
        <Row className="pro_r1">
            <Col sm={7}>
            <Image className="pro_main" src="https://static1.cbrimages.com/wordpress/wp-content/uploads/2023/06/kana-arima-is-looking-annoyed-again.jpg" roundedCircle />
            </Col>
            <Col sm={5} className="pro_contract">
            <div className="contact-row">
                <div className="contract_head">IG:</div>
                <div className="contract_box">XXXXXXX</div>
            </div>
            <div className="contact-row">
                <div className="contract_head">LINE:</div>
                <div className="contract_box">XXXXXXX</div>
            </div>
            <div className="contact-row">
                <div className="contract_head">FACEBOOK:</div>
                <div className="contract_box">XXXXXXX</div>
            </div>
            </Col>
        </Row>
        <Row className="pro_r2">
            <Col className="pro_contract">
                <div className="contact-row">
                    <div className="contract_head">NAME:</div>
                    <div className="contract_box">XXXXXXX</div>
                </div>
            </Col>
            <Col className="pro_contract">
                <div className="contact-row">
                    <div className="contract_head">ABOUT ME:</div>
                    <div className="contract_box">XXXXXXX</div>
                </div>
            </Col>
        </Row>

        <Row className="pro_r3">
            <div >DESCRIPTION</div>
            <div className="pro_des"></div>
        </Row>

        <Row className="pro_r4">
            <div>
                <h3>PROJECT</h3>
            </div>
            <Row>
                <Col className="A">1 of 3</Col>
                <Col className="A">2 of 3</Col>
                <Col className="A">3 of 3</Col>
            </Row>
        </Row>
    </Container>

      


    );
}

export default Profile ;