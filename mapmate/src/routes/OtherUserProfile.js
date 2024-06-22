import React, { useState, useEffect } from "react";
import style from "./EditProfile.module.css";
import { dbService } from "fbase";
import HomeModal from "./HomeModal";

const OtherUserProfile = ({ userId, onClose }) => {
  const [userProfile, setUserProfile] = useState("");
  const [userBio, setUserBio] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [meetList, setMeetList] = useState([]);
  const [selectedMeet, setSelectedMeet] = useState(null);
  const [isHomeModalOpen, setIsHomeModalOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      const getUserInfo = async () => {
        const userSnapshot = await dbService
          .collection("user_info")
          .where("user_id", "==", userId)
          .get();

        userSnapshot.forEach((doc) => {
          const userData = doc.data();
          setUserProfile(userData.profile_picture);
          setUserBio(userData.user_bio);
          setUserEmail(userData.user_email);
          setUserName(userData.user_name);
        });
      };

      const getMeetInfo = async () => {
        const meetSnapshot = await dbService
          .collection("meet_info")
          .where("sendUserid", "==", userId)
          .get();

        const meets = [];
        meetSnapshot.forEach((doc) => {
          meets.push({ mid: doc.id, ...doc.data() });
        });
        setMeetList(meets);
      };

      getUserInfo();
      getMeetInfo();
    }
  }, [userId]);

  const handleOpenHomeModal = (meet) => {
    setSelectedMeet(meet);
    setIsHomeModalOpen(true);
  };

  const handleCloseHomeModal = () => {
    setIsHomeModalOpen(false);
    setSelectedMeet(null);
  };

  return (
    <div className={style.modal_overlay} style={{ zIndex: 6 }}>
      <div className={style.modal}>
        <button className={style.close_modal_btn} onClick={onClose}>
          &times;
        </button>
        <div className={style.profile_info}>
          <img className={style.profile_avatar} src={userProfile} alt="Avatar" />
          <div className={style.profile_details}>
            <h1>{userName}</h1>
            <p>@{userEmail}</p>
            <p>{userBio}</p>
          </div>
        </div>
        <div className={style.profile_tweets}>
          <h2>이 사용자가 만든 약속들</h2>
          {meetList.map((meet, idx) => (
            <div key={idx} className={style.tweet}>
              <p>날짜: {meet.date} 시간: {meet.time}</p>
              <p
                onClick={() => handleOpenHomeModal(meet)}
                style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
              >
                {meet.sendMessage}
              </p>
            </div>
          ))}
        </div>
      </div>
      {isHomeModalOpen && (
        <HomeModal onClose={handleCloseHomeModal} item={selectedMeet} />
      )}
    </div>
  );
};

export default OtherUserProfile;
