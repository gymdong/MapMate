import React, { useEffect, useState } from "react";
import { authService, dbService } from "fbase";
import styles from "./alert.module.css";

const Alert = ({ onNotificationChecked }) => {
  //전체적인 알림을 관리하는 뷰
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

          Promise.all(followNotifications).then(
            (resolvedFollowNotifications) => {
              setNotifications((prev) => [
                ...prev.filter((notif) => notif.type !== "follow"), //타입 검사하여 follow인지 meet_info에서 가져온건지 검사하여 중복방지
                ...resolvedFollowNotifications,
              ]);
            }
          );
        });

      // notifications 리스너
      const unsubscribeNotifications = dbService
        .collection("notifications")
        .where("userId", "==", currentUser.email)
        .onSnapshot((snapshot) => {
          const meetNotifications = snapshot.docs.map((doc) => ({
            id: doc.id,
            type: "meet_info",
            ...doc.data(),
          }));

          setNotifications((prev) => [
            ...prev.filter((notif) => notif.type !== "meet_info"),
            ...meetNotifications,
          ]);
        });

      // 컴포넌트 언마운트 시 리스너 해제
      return () => {
        unsubscribeFollow();
        unsubscribeNotifications();
      };
    }
  }, []);

  const handleCheckNotification = async (id, type) => {
    if (type === "follow") {
      await dbService.collection("follow_info").doc(id).update({
        isChecked: true,
      });
    } else if (type === "meet_info") {
      await dbService.collection("notifications").doc(id).delete();
    }

    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    ); //확인 버튼 눌렀을때 해당 알림의 id로 필터링하여 알림 삭제

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
              <p>{truncateMessage(notification.message, 50)}</p>
            )}
            <button
              className={styles.checkButton}
              onClick={() =>
                handleCheckNotification(notification.id, notification.type)
              }
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
