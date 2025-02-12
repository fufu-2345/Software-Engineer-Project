import React from "react";
import { Link } from 'react-router-dom';
import "./Navbar.css";
import ProfilePopup from "./ProfilePopup";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo"><Link to="/">MyLogo</Link></div>
      <ul className="nav-links">
        <li><ProfilePopup/></li>
      </ul>
    </nav>
  );
};

export default Navbar;
