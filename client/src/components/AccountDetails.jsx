import React, { useState ,useEffect} from "react";
import { Link } from "react-router-dom";

import "./AccountDetails.css";

const AccountDetails = (props) => {

  const { userID } = props

  var [isGuest,setGuest] = useState(false)
  var [isUser,setUser] = useState(false)

  var [accName,setAccName] = useState("My Acc name")
  var [profilePath,setProfilePath] = useState("")

  async function getData(){
      const api = `http://localhost:5000/getData`
      const body = { userID: userID }
      const response = await axios.post(api, body)

      if(response.data.Status == true){
        setAccName(response.data.accName)
        setProfilePath(response.data.profilePath)
        setUser(true)
        setGuest(false)
      }else{
        setGuest(true)
        setUser(false)
      }
  }

  function logOut(){
    const data = {userId : null}
    navigate("/Main", {state : data})
  }
  

  useEffect(() => {
      if (userID) {
        setUser(true)
      } else {
        setGuest(true)
      }
    }, [userID]);
  

  return (
    <div className="account-container">
      <div className="profileContainer">
        {isGuest && <img src={"client/src/default.png"} className="profile-pic" />} 
        {isUser && <img src={"client/src/default.png"} className="profile-pic" />}
      </div>
      {isUser && <div className="Accname"> {accName}</div>}
      {isUser && <button className="logout-btn" onClick={logOut()}>Logout</button> }
    </div>
  );
};

export default AccountDetails;
