import { authService, dbService } from "fbase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import EditProfile from "./Editprofile";
import style from "./Profile.module.css";
const Profile = ({ userData }) => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState("");
  const [userBio, setUserBio] = useState("");
  const [isChangedUser, setIsChangedUser] = useState("");
  const [meetList, setMeetList] = useState([]);
  const [userName, setUserName] = useState("");
  const getMeetInfo = async () => {
    setUserName(authService.currentUser.displayName);
    const data = dbService
      .collection("meet_info")
      .where("sendUser", "==", userName);
    const querySnapshot = await data.get();
    setMeetList([]);
    querySnapshot.forEach((doc) => {
      console.log(doc);
      const { lat, lng, sendMessage, sendUser, date, time } = doc.data();
      if (sendUser === userName) {
        const data = { lat, lng, sendMessage, sendUser, date, time };
        setMeetList((arr) => (arr ? [...arr, data] : [data]));
      }
    });
    console.log(meetList);
  };
  useEffect(() => {
    dbService
      .collection("user_info")
      .where("user_id", "==", authService.currentUser.uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const userData = doc.data(); // 문서의 데이터를 가져옴
          setUserProfile(userData.profile_picture);
          setUserBio(userData.user_bio);
          console.log("프로필 사진 URL:", userProfile);
        });
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
      });
  }, [isChangedUser]); //이거 수정될때마다 리렌더링하도록하자
  useEffect(() => getMeetInfo, []);
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
        <div className={style.profile_info}>
          <img
            className={style.profile_avatar}
            src={userProfile}
            alt="Avatar"
          />
          <div className={style.profile_details}>
            <h1 className={style.profile_name}>{userName}</h1>
            <p className={style.profile_username}>
              @{authService.currentUser.email}
            </p>
            <p className={style.profile_bio}>{userBio}</p>
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
        <h2>내가 만든 약속들</h2>
        {/* 트윗 목록 */}
        {meetList.map((val, idx) => (
          <div className={style.tweet}>
            <p>
              날짜 : {val.date + " "}
              시간 : {val.time}
            </p>
            <p>{val.sendMessage}</p>
          </div>
        ))}
      </div>
      {isEditProfileOpen && (
        <EditProfile
          onClose={handleCloseEditProfile}
          changedUser={setIsChangedUser}
        />
      )}
      <button onClick={onLogOutClick}>Log Out</button>
    </div>
  );
};

export default Profile;
