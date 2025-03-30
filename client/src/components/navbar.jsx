import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "./navbar.css";
import ProfilePopup from "./ProfilePopup";
import axios from "axios";

const Navbar = (props) => {
  const { userID } = props

  var [isGuest, setGuest] = useState(false)
  var [isUser, setUser] = useState(false)

  const fetchData = async () => {
    try {
      const api = `http://localhost:5000/getData`
      const body = { userID: userID }
      const response = await axios.post(api, body)
      if (response.data.Status) {
        setUser(true)
      } else {
        setGuest(true)
        setUser(true)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setGuest(true)

      setUser(true)
    }
  }

  function goMain() {
    const data = { userId: userID }
    navigate("/", { state: data })
  }

  useEffect(() => {
    setGuest(false)
    setUser(true)
    if (userID) {
      fetchData();
    } else {
      setGuest(true)
    }
  }, [userID]);


  return (
    <nav className="navbar">
      <div className="logo" onclick={goMain}>
        <Link to="/Main">
          <img src="../imgs/1.jpg" className="w-20 h-20 rounded-full m-2" alt="Logo" />
        </Link>
      </div>

      <ul className="nav-links">
        {isGuest && <Link to="/login" className="mr-[1rem] my-auto bg-[#a03f85] border border-black rounded-full py-2 px-[1.25rem]">
          Login
        </Link>}
        {isGuest &&
          <Link to="/SelectRegister" className="mr-[1rem] my-auto bg-[#a03f85] border border-black rounded-full py-2 px-[1.25rem]">
            Sign up
          </Link>}
        {isUser && <div className="mr-[1rem] my-auto">
          <ProfilePopup userID={userID} />
        </div>}

      </ul>
    </nav>
  );
};

export default Navbar;
