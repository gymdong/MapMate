import { authService } from "fbase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EditProfile from "./Editprofile";
import style from "./Profile.module.css";
const Profile = ({ userData }) => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const handleOpenEditProfile = () => {
    setIsEditProfileOpen(true);
  };

  const handleCloseEditProfile = () => {
    setIsEditProfileOpen(false);
  };
  const navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  return (
    <div className={style.profile_container}>
      <div className={style.profile_header}>
        <img
          className={style.profile_banner}
          src="https://example.com/banner.jpg"
          alt="Banner"
        />
        <div className={style.profile_info}>
          <img
            className={style.profile_avatar}
            src="https://example.com/avatar.jpg"
            alt="Avatar"
          />
          <div className={style.profile_details}>
            <h1 className={style.profile_name}>
              {authService.currentUser.displayName}
            </h1>
            <p className={style.profile_username}>
              @{authService.currentUser.email}
            </p>
            <p className={style.profile_bio}>설명란</p>
            <button
              className={style.edit_profile_button}
              onClick={handleOpenEditProfile}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
      <div className={style.profile_tweets}>
        <h2>Tweets</h2>
        {/* 트윗 목록 */}
        <div className={style.tweet}>
          <p>This is a tweet.</p>
        </div>
        <div className={style.tweet}>
          <p>This is another tweet.</p>
        </div>
      </div>
      {isEditProfileOpen && <EditProfile onClose={handleCloseEditProfile} />}
      <button onClick={onLogOutClick}>Log Out</button>
    </div>
  );
};

export default Profile;
