import React, { useState } from "react";
import style from "./EditProfile.module.css";
import { authService, dbService } from "fbase";
import OtherUserProfile from "./OtherUserProfile";
import { Map, MapMarker } from "react-kakao-maps-sdk";

function HomeModal({ onClose, item }) {
  const [isOtherUserProfileOpen, setIsOtherUserProfileOpen] = useState(false);
  const [otherUserId, setOtherUserId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [existingLat] = useState(item.lat);
  const [existingLng] = useState(item.lng);
  const [newLat, setNewLat] = useState(item.lat);
  const [newLng, setNewLng] = useState(item.lng);
  const [newDate, setNewDate] = useState(item.date);
  const [newTime, setNewTime] = useState(item.time);
  const [newMessage, setNewMessage] = useState(item.sendMessage);
  const [members, setMembers] = useState(item.member); // 멤버 상태 추가
  const currentUser = authService.currentUser;

  const truncateMessage = (message, maxLength) => {
    //메시지 요약 함수
    if (message.length > maxLength) {
      return message.substring(0, maxLength) + "...";
    }
    return message;
  };

  const notifyMembers = async (message, excludeSelf = true) => {
    const memberNotifications = members.map(async (member) => {
      const userQuery = await dbService
        .collection("user_info")
        .where("user_name", "==", member)
        .get();
      const userData = userQuery.docs[0]?.data();

      if (
        userData &&
        (!excludeSelf || userData.user_email !== currentUser.email)
      ) {
        // 이미 해당 유저에게 같은 메시지가 있는지 확인
        const existingNotificationQuery = await dbService
          .collection("notifications")
          .where("userId", "==", userData.user_email)
          .where("message", "==", message)
          .get();

        if (existingNotificationQuery.empty) {
          // 중복 알림이 없으면 알림 추가
          await dbService.collection("notifications").add({
            userId: userData.user_email,
            message: message,
            isChecked: false,
            timestamp: new Date(),
          });
        }
      }
    });

    await Promise.all(memberNotifications);
  };

  const joinToMeet = async () => {
    //약속 참여
    const docRef = await dbService.collection("meet_info").doc(item.mid);
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const currentData = doc.data();
          const currentMembers = currentData.member || [];
          if (!currentMembers.includes(authService.currentUser.displayName)) {
            docRef
              .update({
                member: [
                  ...currentMembers,
                  authService.currentUser.displayName,
                ],
              })
              .then(() => {
                // 상태 업데이트
                setMembers((prevMembers) => [
                  ...prevMembers,
                  authService.currentUser.displayName,
                ]);
                alert("참여 성공!");
                console.log("멤버 추가 성공");
                const truncatedMessage = truncateMessage(item.sendMessage, 5);
                notifyMembers(
                  `${authService.currentUser.displayName}님이 "${truncatedMessage}" 약속에 참여했습니다.`
                );
              })
              .catch((error) => {
                console.error("멤버 추가 오류:", error);
              });
          } else {
            alert("이미 참여한 약속입니다.");
          }
        } else {
          console.error("문서를 찾을 수 없습니다.");
        }
      })
      .catch((error) => {
        console.error("문서 가져오기 오류:", error);
      });
  };

  const deleteMeet = async () => {
    if (item.sendUserid !== currentUser.uid) {
      alert("본인이 만든 약속만 삭제할 수 있습니다.");
      return;
    }

    const docRef = dbService.collection("meet_info").doc(item.mid);
    docRef
      .delete()
      .then(async () => {
        const truncatedMessage = truncateMessage(item.sendMessage, 5);
        await notifyMembers(
          `${authService.currentUser.displayName}님이 "${truncatedMessage}" 약속을 삭제했습니다.`
        );
        alert("약속 삭제 성공!");
        console.log("삭제 성공");
        onClose(); // 삭제 후 모달 닫기
      })
      .catch((error) => {
        console.error("약속 삭제 오류:", error);
      });
  };

  const editMeet = async (event) => {
    //약속 수정
    event.preventDefault();
    const docRef = dbService.collection("meet_info").doc(item.mid);
    const doc = await docRef.get();

    if (doc.exists) {
      const currentData = doc.data();
      const currentMembers = currentData.member || [];

      if (!currentMembers.includes(currentUser.displayName)) {
        alert("약속의 멤버만 수정할 수 있습니다.");
        return;
      }

      await docRef
        .update({
          sendMessage: newMessage,
          date: newDate,
          time: newTime,
          lat: newLat,
          lng: newLng,
        })
        .then(async () => {
          const truncatedMessage = truncateMessage(item.sendMessage, 5);
          await notifyMembers(
            `${authService.currentUser.displayName}님이 "${truncatedMessage}" 약속을 수정했습니다.`
          );
          alert("약속 수정 성공!");
          console.log("수정 성공");
          setIsEditing(false);
          onClose();
        })
        .catch((error) => {
          console.error("약속 수정 오류:", error);
        });
    } else {
      console.error("문서를 찾을 수 없습니다.");
    }
  };
  //모달과 유사한 뷰. 우선 하드코딩
  const encodedMarkerName = encodeURIComponent(item.sendMessage);
  const mapLink = `https://map.kakao.com/link/map/${encodedMarkerName},${item.lat},${item.lng}`;

  const isMember = members.includes(currentUser.displayName);

  return (
    <div className={style.modal_overlay}>
      <div className={style.modal}>
        <button className={style.close_modal_btn} onClick={onClose}>
          &times;
        </button>
        <h1>약속 정보</h1>
        <div className={style.edit_profile_content}>
          {!isEditing ? (
            <div className={style.meetContainer}>
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className={style.meetText}
              >
                카카오맵에서 위치 확인 바로가기
              </a>
              <p className={style.meetText}>
                개설자 :{" "}
                <span
                  onClick={() => {
                    if (item.sendUserid) {
                      setOtherUserId(item.sendUserid);
                      setIsOtherUserProfileOpen(true);
                    } else {
                      alert("존재하지 않는 유저입니다.");
                    }
                  }}
                  style={{
                    color: "blue",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  className={style.meetText}
                >
                  {item.sendUser}
                </span>
              </p>
              <p className={style.meetText}>
                날짜 : {item.date} {item.time}
              </p>
              <p className={style.meetText}>내용 : {item.sendMessage}</p>
              <p className={style.meetText}>
                현재 참여자 :{" "}
                {members.map((mem, idx) => (
                  <span key={idx}>
                    {idx === members.length - 1 ? mem : mem + ", "}
                  </span>
                ))}
              </p>
              <div className={style.buttonContainer}>
                <button onClick={joinToMeet} className={style.meetButton}>
                  참여하기
                </button>
                {(isMember || item.sendUserid === currentUser.uid) && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      style={{ marginLeft: "10px" }}
                      className={style.meetButton}
                    >
                      약속 수정
                    </button>
                    {item.sendUserid === currentUser.uid && (
                      <button
                        onClick={deleteMeet}
                        style={{ marginLeft: "10px" }}
                        className={style.meetButton}
                      >
                        약속 삭제
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className={style.modal_content}>
              <Map
                center={{ lat: existingLat, lng: existingLng }}
                style={{ width: "460px", height: "300px" }}
                onClick={(_, mouseEvent) => {
                  const latlng = mouseEvent.latLng;
                  setNewLat(latlng.getLat());
                  setNewLng(latlng.getLng());
                }}
              >
                <MapMarker position={{ lat: newLat, lng: newLng }} />
              </Map>
              <div>
                <input
                  type="date"
                  id="meet_start"
                  className={style.sendInput}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
                <input
                  id="meet_time"
                  type="time"
                  className={style.sendInput}
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                />
              </div>
              <textarea
                placeholder="약속 내용이 무엇인가요?"
                rows="4"
                id="subText"
                className={style.sendTextArea}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              ></textarea>
              <div className={style.buttonBox}>
                <button className={style.meetButton} onClick={editMeet}>
                  수정하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {isOtherUserProfileOpen && (
        <OtherUserProfile
          userId={otherUserId}
          onClose={() => setIsOtherUserProfileOpen(false)}
        />
      )}
    </div>
  );
}

export default HomeModal;
