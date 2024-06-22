import React, { useState, useEffect } from "react";
import style from "./EditProfile.module.css";

function HomeModal({ onClose, item }) {
  console.log(item);
  return (
    <div className={style.modal_overlay}>
      <div className={style.modal}>
        <button className={style.close_modal_btn} onClick={onClose}>
          &times;
        </button>
        <h2>약속 정보</h2>
        <div className={style.edit_profile_content}>
          <div>
            <p>개설자 : {item.sendUser}</p>
            <p>날짜: {item.date}</p>
            <p>시간: {item.time}</p>
            <p>위치: {item.lat}</p> {/* 여기 주소값으로 수정해야함 */}
            <p>정보: {item.sendMessage}</p>
            <p>현재 참여자 : {item.member}</p>
            <button>참여하기</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeModal;
