import React, { useEffect, useState } from "react";
import { authService, dbService } from "fbase";
import styles from "./alert.module.css";

const Alert = ({ onNotificationChecked }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const currentUser = authService.currentUser;
      if (currentUser) {
        const alertQuery = await dbService
          .collection("follow_info")
          .where("receiver", "==", currentUser.email)
          .where("isChecked", "==", false)
          .get();

        const notificationsData = await Promise.all(
          alertQuery.docs.map(async (doc) => {
            const data = doc.data();
            const senderQuery = await dbService
              .collection("user_info")
              .where("user_email", "==", data.sender)
              .get();
            const senderData = senderQuery.docs[0]?.data();

            return {
              id: doc.id,
              senderName: senderData?.user_name,
              ...data,
            };
          })
        );

        setNotifications(notificationsData);
      }
    };

    fetchNotifications();
  }, []);

  const handleCheckNotification = async (id) => {
    await dbService.collection("follow_info").doc(id).update({
      isChecked: true,
    });

    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );

    if (onNotificationChecked) {
      onNotificationChecked(); // 알림 확인 시 콜백 호출
    }
  };

  return (
    <div className={styles.alertContainer}>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div key={notification.id} className={styles.notificationItem}>
            <p>{`${notification.senderName}님이 팔로우했습니다.`}</p>
            <button
              className={styles.checkButton}
              onClick={() => handleCheckNotification(notification.id)}
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
