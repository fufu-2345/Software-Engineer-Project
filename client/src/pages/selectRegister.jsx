import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/navbar";
import "../index.css";

const RegisterNonClub = () => {

  return (
    <>
      <Navbar />
      <div className="registerPage">
        <div className="registerBox">
          Registration For ...
          <div className="selectRegisterBox">
            <div className="userType"><Link to="/RegisterClub">Club Member</Link></div>
            <div className="userType"><Link to="/RegisterNonClub">External User</Link></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterNonClub;
