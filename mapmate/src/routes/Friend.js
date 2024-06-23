import React, { useState, useEffect } from "react";
import { authService, dbService } from "fbase";
import style from "./friend.module.css";

const Friend = () => {
  //팔로우, 팔로잉 관리를 위한 뷰
  const [activeTab, setActiveTab] = useState("search");
  const [findUser, setFindUser] = useState("");
  const [userData, setUserData] = useState([]);
  const [isFindUserFinished, setIsFindUserFinished] = useState(false);
  const [followingData, setFollowingData] = useState([]);
  const [followerData, setFollowerData] = useState([]);

  const FindUser = async (event) => {
    event.preventDefault();
    const currentUser = authService.currentUser;
    const q = dbService
      .collection("user_info")
      .where("user_email", "==", findUser);
    const querySnapshot = await q.get();
    setUserData([]);
    querySnapshot.forEach((doc) => {
      const { profile_picture, user_bio, user_email, user_id, user_name } =
        doc.data();
      if (user_email !== currentUser.email) {
        const data = {
          profile_picture,
          user_bio,
          user_email,
          user_id,
          user_name,
        };
        setUserData((arr) => (arr ? [...arr, data] : [data]));
      }
    });
    setIsFindUserFinished(true);
  };

  const FindUserInput = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "FriendID") {
      setFindUser(value);
    }
  };

  const loadFollowing = async () => {
    const currentUser = authService.currentUser;
    if (currentUser) {
      const followQuery = await dbService
        .collection("follow_info")
        .where("sender", "==", currentUser.email)
        .get();

      const followingPromises = followQuery.docs.map(async (doc) => {
        const userQuery = await dbService
          .collection("user_info")
          .where("user_email", "==", doc.data().receiver)
          .get();

        return userQuery.docs.map((userDoc) => userDoc.data());
      });

      const followingList = await Promise.all(followingPromises);
      setFollowingData(followingList.flat());
    }
  };

  const loadFollowers = async () => {
    const currentUser = authService.currentUser;
    if (currentUser) {
      const followQuery = await dbService
        .collection("follow_info")
        .where("receiver", "==", currentUser.email)
        .get();

      const followerPromises = followQuery.docs.map(async (doc) => {
        const userQuery = await dbService
          .collection("user_info")
          .where("user_email", "==", doc.data().sender)
          .get();

        return userQuery.docs.map((userDoc) => userDoc.data());
      });

      const followerList = await Promise.all(followerPromises);
      setFollowerData(followerList.flat());
    }
  };

  useEffect(() => {
    if (activeTab === "following") {
      loadFollowing();
    } else if (activeTab === "followers") {
      loadFollowers();
    }
  }, [activeTab]);

  return (
    <div>
      <div className={style.tabContainer}>
        <button
          className={activeTab === "search" ? style.activeTab : style.tab}
          onClick={() => setActiveTab("search")}
        >
          친구 검색
        </button>
        <button
          className={activeTab === "following" ? style.activeTab : style.tab}
          onClick={() => setActiveTab("following")}
        >
          팔로잉
        </button>
        <button
          className={activeTab === "followers" ? style.activeTab : style.tab}
          onClick={() => setActiveTab("followers")}
        >
          팔로워
        </button>
      </div>
      <div className={style.userListContainer}>
        {activeTab === "search" && (
          <div className={style.findUserContainer}>
            <form className={style.findUserForm} onSubmit={FindUser}>
              <div className={style.findUserInputBox}>
                <input
                  className={style.findUserInput}
                  name="FriendID"
                  type="text"
                  value={findUser}
                  required
                  placeholder="이메일을 입력해주세요."
                  onChange={FindUserInput}
                />
                <button className={style.findUserButton} type="submit">
                  찾기
                </button>
              </div>
            </form>
            <div className={style.userListContainer}>
              {userData.length || !isFindUserFinished
                ? userData.map((data, index) => (
                    <UserList key={index} data={data} />
                  ))
                : "해당 유저 정보를 찾을 수 없습니다."}
            </div>
          </div>
        )}
        {activeTab === "following" && (
          <div className={style.userListContainer}>
            {followingData.length > 0
              ? followingData.map((data, index) => (
                  <UserList key={index} data={data} />
                ))
              : "팔로우한 사용자가 없습니다."}
          </div>
        )}
        {activeTab === "followers" && (
          <div className={style.userListContainer}>
            {followerData.length > 0
              ? followerData.map((data, index) => (
                  <UserList key={index} data={data} />
                ))
              : "나를 팔로우한 사용자가 없습니다."}
          </div>
        )}
      </div>
    </div>
  );
};

const UserList = ({ data }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkFollowingStatus = async () => {
      const currentUser = authService.currentUser;
      if (currentUser) {
        const followQuery = await dbService
          .collection("follow_info")
          .where("sender", "==", currentUser.email)
          .where("receiver", "==", data.user_email)
          .get();

        if (!followQuery.empty) {
          setIsFollowing(true);
        } else {
          setIsFollowing(false); // 팔로우 상태를 명확히 설정
        }
      }
    };

    checkFollowingStatus();
  }, [data.user_email]); // data.user_email이 변경될 때마다 실행

  const handleFollow = async () => {
    const currentUser = authService.currentUser;
    if (currentUser && !isFollowing) {
      await dbService.collection("follow_info").add({
        receiver: data.user_email,
        sender: currentUser.email,
        isChecked: false, // 알림 확인 여부
      });
      setIsFollowing(true);
    } else if (currentUser && isFollowing) {
      const followQuery = await dbService
        .collection("follow_info")
        .where("sender", "==", currentUser.email)
        .where("receiver", "==", data.user_email)
        .get();

      followQuery.forEach(async (doc) => {
        await dbService.collection("follow_info").doc(doc.id).delete();
      });
      setIsFollowing(false);
    }
  };

  return (
    <div className={style.userItem}>
      <img
        src={data.profile_picture}
        alt={data.user_name}
        className={style.profile_avatar}
      />
      <div className={style.userDetails}>
        <div className={style.userName}>{data.user_name}</div>
        <div className={style.userEmail}>@{data.user_email}</div>
        <div className={style.userBio}>{data.user_bio}</div>
      </div>
      {isFollowing ? (
        <button className={style.followingButton} onClick={handleFollow}>
          팔로우 중
        </button>
      ) : (
        <button className={style.followButton} onClick={handleFollow}>
          팔로우하기
        </button>
      )}
    </div>
  );
};

export default Friend;
