import React, { useState, useRef, useEffect } from "react";
import AccountDetails from "./AccountDetails";
import "./ProfilePopup.css";

const ProfilePopup = (props) => {

  const { userID } = props

  const [open, setOpen] = useState(false);
  const popupRef = useRef(null);
  const profileRef = useRef(null);

  const handleClick = () => {
    setOpen((prev) => !prev); // Toggle popup
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target) && profileRef.current !== event.target) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  return (
    <div className="profile-container">
      <img 
        ref={profileRef}
        src={"client\src\default.png"} 
        className="profile-icon" 
        onClick={handleClick} 
      />

      {open && (
        <div 
          ref={popupRef}
          className="popup-box"
        >
          <AccountDetails userID = {userID}/>
        </div>
      )}
    </div>
  );
};

export default ProfilePopup;
