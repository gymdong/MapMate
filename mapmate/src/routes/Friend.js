import React, { useState, useEffect } from "react";
import { authService, dbService } from "fbase";
import style from "./friend.module.css";

const Friend = () => {
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
      const { user_email, user_id, user_name } = doc.data();
      if (user_email !== currentUser.email) {
        const data = { user_email, user_id, user_name };
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

      const followingList = [];
      followQuery.forEach((doc) => {
        followingList.push(doc.data().receiver);
      });
      setFollowingData(followingList);
    }
  };

  const loadFollowers = async () => {
    const currentUser = authService.currentUser;
    if (currentUser) {
      const followQuery = await dbService
        .collection("follow_info")
        .where("receiver", "==", currentUser.email)
        .get();

      const followerList = [];
      followQuery.forEach((doc) => {
        followerList.push(doc.data().sender);
      });
      setFollowerData(followerList);
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
              ? followingData.map((email, index) => (
                  <div key={index} className={style.userItem}>
                    {email}
                  </div>
                ))
              : "팔로우한 사용자가 없습니다."}
          </div>
        )}
        {activeTab === "followers" && (
          <div className={style.userListContainer}>
            {followerData.length > 0
              ? followerData.map((email, index) => (
                  <div key={index} className={style.userItem}>
                    {email}
                  </div>
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
        }
      }
    };

    checkFollowingStatus();
  }, [data.user_email]);

  const handleFollow = async () => {
    const currentUser = authService.currentUser;
    if (currentUser && !isFollowing) {
      await dbService.collection("follow_info").add({
        receiver: data.user_email,
        sender: currentUser.email,
      });
      setIsFollowing(true);
      console.log(`${(data.user_email, data.user_id, data.user_name)}`);
    }
  };

  return (
    <div className={style.userItem}>
      {data.user_name}
      {isFollowing ? (
        <span className={style.followingButton}>팔로우 중</span>
      ) : (
        <button className={style.followButton} onClick={handleFollow}>
          팔로우하기
        </button>
      )}
    </div>
  );
};

export default Friend;
