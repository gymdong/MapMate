import React, { useState, useEffect } from "react";
import style from "./EditProfile.module.css";

function CalendarModal({ onClose, meet }) {
  console.log(meet);
  const [addresses, setAddresses] = useState([]);

  /*useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      console.error("Kakao Maps API is not loaded");
      return;
    }

    window.kakao.maps.load(() => {
      if (!window.kakao.maps.services) {
        console.error("Kakao Maps services is not loaded");
        return;
      }
      const geocoder = new window.kakao.maps.services.Geocoder();

      // 좌표를 주소로 변환하여 상태에 저장
      const getAddressFromCoords = (coords, callback) => {
        geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
      };

      // meet 배열에 있는 각 좌표를 주소로 변환
      const addressesPromises = meet.map((item) => {
        return new Promise((resolve) => {
          const coords = new window.kakao.maps.LatLng(item.lat, item.lng);
          getAddressFromCoords(coords, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const address = result[0].address.address_name;
              resolve(address);
            } else {
              resolve("Address not found");
            }
          });
        });
      });

      // 모든 주소 변환이 완료되면 상태 업데이트
      Promise.all(addressesPromises).then((resolvedAddresses) => {
        setAddresses(resolvedAddresses);
      });
    });
  }, [meet]);*/
  return (
    <div className={style.modal_overlay}>
      <div className={style.modal}>
        <button className={style.close_modal_btn} onClick={onClose}>
          &times;
        </button>
        <h2>약속 정보</h2>
        <div className={style.edit_profile_content}>
          {meet.map((val, idx) => {
            const encodedMarkerName = encodeURIComponent(val.sendMessage);
            const mapLink = `https://map.kakao.com/link/map/${encodedMarkerName},${val.lat},${val.lng}`;
            return (
              <div>
                <a href={mapLink} target="_blank" rel="noopener noreferrer">
                  카카오맵에서 위치 확인하기
                </a>
                <p>날짜: {val.date}</p>
                <p>시간: {val.time}</p>
                <p></p>
                {/* 여기 주소값으로 수정해야함 */}
                <p>정보: {val.sendMessage}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CalendarModal;
