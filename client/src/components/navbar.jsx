import React, { useState , useEffect } from "react";
import { Link } from 'react-router-dom';
import "./Navbar.css";
import ProfilePopup from "./ProfilePopup";
import axios from "axios";

const Navbar = (props) => {
  const {userID} = props

  var [isGuest,setGuest] = useState(false)
  var [isUser,setUser] = useState(false)

  const fetchData = async () => {
    try {
      const api = `http://localhost:5000/getData`
      const body = { userID: userID }
      const response = await axios.post(api, body)
      if(response.data.Status){
        setUser(true)
      }else{
        setGuest(true)
        setUser(true)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setGuest(true)

      setUser(true)
    }
  }


  useEffect(() => {
    setGuest(false)
    //setUser(false)
    setUser(true)
    if (userID) {
      fetchData();
    } else {
      setGuest(true)
    }
  }, [userID]);


  return (
    <nav className="navbar">
      <div className="logo"><Link to="/Main">MyLogo</Link></div>
      <ul className="nav-links">
        {isGuest && <li className="navButton"><Link to="/">Login</Link></li>}
        {isGuest && <li className="navButton"><Link to="/SelectRegister">Sign up</Link></li> }
        {isUser && <li className="navButton"> <ProfilePopup userID = {userID}/></li>}
      </ul>
    </nav>
  );
};

export default Navbar;
