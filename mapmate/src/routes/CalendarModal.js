import React, { useState, useEffect } from "react";
import style from "./EditProfile.module.css";

function CalendarModal({ onClose, meet, selectedDate }) {
  console.log(meet); //해당 날짜의 약속들의 정보
  const [addresses, setAddresses] = useState([]);

  return (
    <div className={style.modal_overlay}>
      <div className={style.modal}>
        <button className={style.close_modal_btn} onClick={onClose}>
          &times;
        </button>
        <h2>약속 정보</h2>
        <div className={style.edit_profile_content}>
          {meet.length > 0 ? ( //위치를 카카오맵에서 바로 확인할 수 있게
            meet.map((val, idx) => {
              const encodedMarkerName = encodeURIComponent(val.sendMessage);
              const mapLink = `https://map.kakao.com/link/map/${encodedMarkerName},${val.lat},${val.lng}`;
              return (
                <div className={style.meetContainer_c}>
                  <a
                    className={style.meetText}
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    카카오맵에서 위치 확인하기
                  </a>
                  <p className={style.meetText}>
                    날짜: {val.date + " "}
                    {val.time}
                  </p>
                  <p></p>
                  <p className={style.meetText}>내용: {val.sendMessage}</p>
                  <p className={style.meetText}>
                    현재 참여자:{" "}
                    {val.member?.map((mem, idx) => (
                      <span key={idx}>
                        {idx === val.member.length - 1 ? mem : mem + ", "}
                      </span>
                    ))}
                  </p>
                </div>
              );
            })
          ) : (
            <p>
              {selectedDate + " "}에는 약속이 없는 것 같군요! 과제나 할까요?
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarModal;
