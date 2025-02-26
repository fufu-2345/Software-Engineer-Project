import React from "react";
import "./AccountDetails.css";

const AccountDetails = ({ name, email, profilePic }) => {
  return (
    <div className="account-container">
      <img src={profilePic} alt="Profile" className="profile-pic" />
      <h2>{name}</h2>
      <p>{email}</p>
      <button className="logout-btn">Logout</button>
    </div>
  );
};

export default AccountDetails;
