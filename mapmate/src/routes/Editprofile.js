import React, { useState } from "react";
import style from "./EditProfile.module.css";
import { v4 as uuidv4 } from "uuid";
import { storageService } from "fbase";
import { authService } from "fbase";

function EditProfile({ onClose }) {
  const [bio, setBio] = useState("This is a short bio.");
  const [avatar, setAvatar] = useState("");

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleAvatarChange = async (event) => {
    const {
      target: { files },
    } = event;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAvatar(result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
    const attachmentRef = storageService
      .ref()
      .child(`${authService.currentUser.uid}/${uuidv4()}`);
    const response = await attachmentRef.putString(avatar, "data_url");
    console.log(response);
  };

  return (
    <div className={style.modal_overlay}>
      <div className={style.modal}>
        <button className={style.close_modal_btn} onClick={onClose}>
          &times;
        </button>
        <h2>Edit Profile</h2>
        <div className={style.edit_profile_content}>
          <div className={style.avatar_section}>
            <img className={style.profile_avatar} src={avatar} alt="Avatar" />
            <input type="file" onChange={handleAvatarChange} accept="image/*" />
          </div>
          <div className={style.bio_section}>
            <textarea
              className={style.bio_input}
              value={bio}
              onChange={handleBioChange}
              rows="4"
            ></textarea>
          </div>
          <button className={style.save_button} onClick={onClose}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
