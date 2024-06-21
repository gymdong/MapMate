import React, { useState } from "react";
import { dbService } from "fbase";
import style from './friend.module.css';

const Friend = () => {
    const [findUser, setFindUser] = useState("");
    const [userData, setUserData] = useState([]);
    const [isFindUserFinished, setIsFindUserFinished] = useState(false);

    const FindUser = async (event) => {
        event.preventDefault();
        const q = dbService.collection("user_info").where("user_email", "==", findUser);
        const querySnapshot = await q.get();
        setUserData([]);
        querySnapshot.forEach((doc) => {
            const { user_email, user_id, user_name } = doc.data();
            const data = { user_email, user_id, user_name };
            setUserData(arr => arr ? [...arr, data] : [data]);
        });
        setIsFindUserFinished(true);
    };

    const FindUserInput = (event) => {
        const {
            target: { name, value },
        } = event;
        if (name === "FriendID") {
            setFindUser(value);
        };
    };

    return (
        <>
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
                <button className={style.findUserButton} type="submit">찾기</button>
              </div>
            </form>
          </div>
          <div className={style.userListContainer}>
            {userData.length || !isFindUserFinished
              ? userData.map((data, index) => (
                  <UserList key={index} data={data} />
                ))
              : '해당 유저 정보를 찾을 수 없습니다.'}
          </div>
        </>
      );
      
};

const UserList = ({ data }) => (
    <div className={style.userItem}>
      {data.user_name}
      <button className={style.followButton} onClick={handleFollow}>팔로우하기</button>
    </div>
  );
  
  const handleFollow = (userName) => {
    console.log(`팔로우: ${userName}`);
  };

export default Friend;
