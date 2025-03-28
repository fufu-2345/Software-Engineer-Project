import React, { useState, useRef, useEffect } from "react";
import AccountDetails from "./AccountDetails";
import "./ProfilePopup.css";

const ProfilePopup = (props) => {

  const { userID } = props

  const [open, setOpen] = useState(false);
  const popupRef = useRef(null);
  const profileRef = useRef(null);
  const [pic, setPic] = useState("");

  const handleClick = () => {
    setOpen((prev) => !prev); // Toggle popup
  };

  useEffect(() => {
    if (!userID) return;

    fetch(`http://localhost:5000/getProfile/imgs2?search=${userID}`)
      .then(res => res.json())
      .then(data => {
        if (data !== null) {
          setPic(data[0]);
          console.log("20", pic);
        }
      })
      .catch(err => console.error("Error fetching profile image:", err));
  }, [userID]);

  useEffect(() => {
    if (pic === "" || pic === undefined) {
      setPic("default.png");
    }
  }, [pic]);

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
        src={`http://localhost:5000/profilePicture/${pic}`}
        className="profile-icon"
        onClick={handleClick}
      />

      {open && (
        <div
          ref={popupRef}
          className="popup-box"
        >
          <AccountDetails userID={userID} />
        </div>
      )}
    </div>
  );
};

export default ProfilePopup;
