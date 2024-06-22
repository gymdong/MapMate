import React, { useState, useEffect  } from "react";
import style from "./EditProfile.module.css";
import { authService, dbService } from "fbase";
import OtherUserProfile from "./OtherUserProfile";

function HomeModal({ onClose, item }) {
  //console.log(item);
  const [isOtherUserProfileOpen, setIsOtherUserProfileOpen] = useState(false);
  const [otherUserId, setOtherUserId] = useState("");

  const joinToMeet = async () => {
    //console.log(item);
    const docRef = await dbService.collection("meet_info").doc(item.mid);
    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const currentData = doc.data();
          const currentMembers = currentData.member || [];
          // 중복 확인 후 멤버 추가
          if (!currentMembers.includes(authService.currentUser.displayName)) {
            docRef
              .update({
                member: [...currentMembers, authService.currentUser.displayName],
              })
              .then(() => {
                console.log("멤버 추가 성공");
              })
              .catch((error) => {
                console.error("멤버 추가 오류:", error);
              });
          } else {
            alert("중복된 멤버입니다.");
          }
        } else {
          console.error("문서를 찾을 수 없습니다.");
        }
      })
      .catch((error) => {
        console.error("문서 가져오기 오류:", error);
      });
  };
  const encodedMarkerName = encodeURIComponent(item.sendMessage);
  const mapLink = `https://map.kakao.com/link/map/${encodedMarkerName},${item.lat},${item.lng}`;
  return (
    <div className={style.modal_overlay}>
      <div className={style.modal}>
        <button className={style.close_modal_btn} onClick={onClose}>
          &times;
        </button>
        <h2>약속 정보</h2>
        <div className={style.edit_profile_content}>
          <div>
            <a href={mapLink} target="_blank" rel="noopener noreferrer">
              카카오맵에서 위치 확인하기
            </a>
            <p>
              개설자:{" "}
              <span
                onClick={() => {
                  if (item.sendUserid) {
                    setOtherUserId(item.sendUserid);
                    setIsOtherUserProfileOpen(true);
                  } else {
                    alert("존재하지 않는 유저입니다."); //데이터베이스 meet_info에 sendUserid가 없을 경우
                  }
                }}
                style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
              >
                {item.sendUser}
              </span>
            </p>
            <p>날짜: {item.date}</p>
            <p>시간: {item.time}</p>
            <p>정보: {item.sendMessage}</p>
            <p>
              현재 참여자:{" "}
              {item.member.map((mem, idx) => (
                <span key={idx}>
                  {idx === item.member.length - 1 ? mem : mem + ", "}
                </span>
              ))}
            </p>
            <button onClick={joinToMeet}>참여하기</button>
          </div>
        </div>
      </div>
      {isOtherUserProfileOpen && (
        <OtherUserProfile userId={otherUserId} onClose={() => setIsOtherUserProfileOpen(false)} />
      )}
    </div>
  );
}

export default HomeModal;
