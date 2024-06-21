import React, { useState } from "react";
import { dbService } from "fbase";

const Friend = () => {
  const [findUser, setFindUser] = useState("");
  const [userData, setUserData] = useState([]);
  const [isFindUserFinished, setIsFindUserFinished] = useState(false);

  const FindUser = async (event) => {
    event.preventDefault();
    const q = dbService
      .collection("user_info")
      .where("user_email", "==", findUser);
    const querySnapshot = await q.get();
    setUserData([]);
    querySnapshot.forEach((doc) => {
      const { user_email, user_id, user_name } = doc.data();
      const data = { user_email, user_id, user_name };
      setUserData((arr) => (arr ? [...arr, data] : [data]));
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

  return (
    <>
      <div>
        <form onSubmit={FindUser}>
          <div className="FindUserInputBox">
            <input
              className="FindUserInput"
              name="FriendID"
              type="text"
              value={findUser}
              required
              placeholder="이메일을 입력해주세요."
              onChange={FindUserInput}
            />
            <button type="submit"></button>
          </div>
        </form>
      </div>
      <div>
        {userData.length || !isFindUserFinished
          ? userData.map((data, index) => <UserList key={index} data={data} />)
          : "해당 유저정보를 찾을수없습니다."}
      </div>
    </>
  );
};

const UserList = ({ data }) => {
  const handleFollow = () => {
    console.log("팔로우하기 버튼.", data.user_id);
  };

  return (
    <div>
      <p>{data.user_name}</p>
      <button onClick={handleFollow}>팔로우하기</button>
    </div>
  );
};

export default Friend;
