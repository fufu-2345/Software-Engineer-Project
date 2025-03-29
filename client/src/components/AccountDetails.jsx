import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

import "./AccountDetails.css";

const AccountDetails = (props) => {
  const navigate = useNavigate();
  const { userID } = props
  const defau = "default.png"

  var [isGuest, setGuest] = useState(false)
  var [isUser, setUser] = useState(false)

  var [accName, setAccName] = useState("My Acc name")
  var [profilePath, setProfilePath] = useState("")

  const goProfile = () => {
    navigate('/profile', { state: { userId: userID, loggedInUser: userID } });
  };

  async function getData() {
    const api = `http://localhost:5000/getData2`
    const body = { userID: userID }
    const response = await axios.post(api, body)

    if (response.data.Status == true) {
      setAccName(response.data.accName)
      if (response.data.profilePath === "" || response.data.profilePath === undefined) {
        setProfilePath("default.png");
      }
      else {
        setProfilePath(response.data.profilePath)
      }

      setUser(true)
      setGuest(false)
    } else {
      setGuest(true)
      setUser(false)
    }
  }

  function logOut() {
    const data = { userId: null }
    navigate("/", { state: data })
  }


  useEffect(() => {
    if (userID) {
      setUser(true)
      getData();
    } else {
      setGuest(true)
    }
  }, [userID]);


  return (
    <div className="account-container">
      <div className="profileContainer">
        {isGuest && <img src={`http://localhost:5000/profilePicture/${defau}`} className="profile-pic" />}
        {isUser && <img src={`http://localhost:5000/profilePicture/${profilePath}`} className="profile-pic" />}
      </div>

      {isUser && <div className="Accname"> {accName}</div>}
      {isUser &&
        <div className="cursor-pointer mx-auto my-[1rem] center border border-black w-[80%] rounded-full h-[2rem]" onClick={goProfile}>
          <p className="text-[#555]">Your profile</p>
        </div>
      }
      {isUser && <button className="logout-btn" onClick={logOut}>Logout</button>}
    </div>
  );
};

export default AccountDetails;
