import React, { useState, useEffect } from "react";
import { authService, dbService } from "fbase";
import style from './friend.module.css';

const Friend = () => {
    const [findUser, setFindUser] = useState("");
    const [userData, setUserData] = useState([]);
    const [isFindUserFinished, setIsFindUserFinished] = useState(false);

    const FindUser = async (event) => {
        event.preventDefault();
        const currentUser = authService.currentUser;
        const q = dbService.collection("user_info").where("user_email", "==", findUser);
        const querySnapshot = await q.get();
        setUserData([]);
        querySnapshot.forEach((doc) => {
            const { user_email, user_id, user_name } = doc.data();
            if (user_email !== currentUser.email) {
                const data = { user_email, user_id, user_name };
                setUserData(arr => arr ? [...arr, data] : [data]);
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

const UserList = ({ data }) => {
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const checkFollowingStatus = async () => {
            const currentUser = authService.currentUser;
            if (currentUser) {
                const followQuery = await dbService.collection("follow_info")
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
            console.log(`${data.user_email, data.user_id, data.user_name}`);
        }
    };

    return (
        <div className={style.userItem}>
            {data.user_name}
            {isFollowing ? (
                <span className={style.followButton}>팔로우 중</span>
            ) : (
                <button className={style.followButton} onClick={handleFollow}>팔로우하기</button>
            )}
        </div>
    );
};

export default Friend;
