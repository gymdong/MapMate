import React, { useEffect, useState } from "react";
import { authService, dbService } from "fbase";
import styles from "./alert.module.css";

const Alert = ({ onNotificationChecked }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const currentUser = authService.currentUser;

    if (currentUser) {
      // follow_info 알림 리스너
      const unsubscribeFollow = dbService
        .collection("follow_info")
        .where("receiver", "==", currentUser.email)
        .where("isChecked", "==", false)
        .onSnapshot((snapshot) => {
          const followNotifications = snapshot.docs.map(async (doc) => {
            const data = doc.data();
            const senderQuery = await dbService
              .collection("user_info")
              .where("user_email", "==", data.sender)
              .get();
            const senderData = senderQuery.docs[0]?.data();

            return {
              id: doc.id,
              senderName: senderData?.user_name,
              type: "follow",
              ...data,
            };
          });

          Promise.all(followNotifications).then((resolvedFollowNotifications) => {
            setNotifications((prev) => [...prev, ...resolvedFollowNotifications]);
          });
        });

      // meet_info 리스너
      const unsubscribeMeetInfo = dbService.collection("meet_info").onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "modified") {
            const data = change.doc.data();
            const newMember = data.member[data.member.length - 1]; // 배열의 마지막 항목

            if (newMember && currentUser && data.sendUserid === currentUser.uid) {
              setNotifications((prev) => [
                ...prev,
                {
                  id: change.doc.id,
                  newMember,
                  sendMessage: data.sendMessage,
                  type: "meet_info",
                  ...data,
                },
              ]);
            }
          }
        });
      });

      // 컴포넌트 언마운트 시 리스너 해제
      return () => {
        unsubscribeFollow();
        unsubscribeMeetInfo();
      };
    }
  }, []);

  const handleCheckNotification = async (id, type) => {
    if (type === "follow") {
      await dbService.collection("follow_info").doc(id).update({
        isChecked: true,
      });
    } else if (type === "meet_info") {
      // meet_info 컬렉션 업데이트 로직용 빈자리
    }

    setNotifications((prev) => prev.filter((notification) => notification.id !== id));

    if (onNotificationChecked) {
      onNotificationChecked(); // 알림 확인 시 콜백 호출
    }
  };

  const truncateMessage = (message, maxLength) => {
    if (message.length > maxLength) {
      return message.substring(0, maxLength) + "...";
    }
    return message;
  };

  return (
    <div className={styles.alertContainer}>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div key={notification.id} className={styles.notificationItem}>
            {notification.type === "follow" ? (
              <p>{`${notification.senderName}님이 팔로우했습니다.`}</p>
            ) : (
              <p>{`"${truncateMessage(notification.sendMessage, 5)}"에 ${notification.newMember}님이 참여했습니다.`}</p>
            )}
            <button
              className={styles.checkButton}
              onClick={() => handleCheckNotification(notification.id, notification.type)}
            >
              확인
            </button>
          </div>
        ))
      ) : (
        <p>새로운 알림이 없습니다.</p>
      )}
    </div>
  );
};

export default Alert;
