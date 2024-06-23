import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css"; // 모듈 CSS 파일 임포트
import { dbService, authService } from "fbase";
import CalendarModal from "./CalendarModal";

function CalendarView() {
  //약속을 캘린더에 나타내게 하는 뷰
  const [value, setValue] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meetList, setMeetList] = useState([]);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [selectedMeet, setSelectedMeet] = useState([]);

  const getMeetInfo = async () => {
    let data;
    if (authService.currentUser) {
      data = dbService
        .collection("meet_info")
        .where("sendUserid", "==", authService.currentUser.uid);
    } else {
      // currentUser가 null인 경우 처리
      console.log("User is not logged in");
      data = null;
    }
    if (authService.currentUser) {
      const querySnapshot = await data.get();
      setMeetList([]);
      querySnapshot.forEach((doc) => {
        console.log(doc);
        const {
          lat,
          lng,
          sendMessage,
          sendUser,
          date,
          time,
          member,
          sendUserid,
        } = doc.data();
        if (sendUserid === authService.currentUser.uid) {
          const data = {
            lat,
            lng,
            sendMessage,
            sendUser,
            date,
            time,
            member,
            sendUserid,
          };
          setMeetList((arr) => (arr ? [...arr, data] : [data]));
        }
      });
    } else {
      // currentUser가 null인 경우 처리
      console.log("User is not logged in");
      data = null;
    }
  };

  const handleDateClick = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth()는 0부터 시작하므로 1을 더해줌
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setSelectedDate(formattedDate);
    const selected = meetList.filter((data) => data.date === formattedDate);
    setSelectedMeet(selected);
    // 클릭한 날짜에 대한 추가적인 작업 수행
    console.log(selected);
    setIsCalendarModalOpen(true);
  };

  useEffect(() => getMeetInfo, []);
  const handleCloseCalendarModal = () => {
    setIsCalendarModalOpen(false);
  };
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const appointment = meetList.find(
        (appointment) =>
          new Date(appointment.date).toDateString() === date.toDateString()
      );
      return appointment ? <div className="appointment">★</div> : null;
    } //약속이 있는 날엔 별표
  };
  //캘린더 라이브러리 사용
  return (
    <div className="calendar-container">
      <Calendar
        onChange={setValue}
        value={value}
        tileContent={tileContent}
        className="react-calendar"
        onClickDay={handleDateClick}
      />
      {isCalendarModalOpen && (
        <CalendarModal //캘린더 날짜 클릭시 해당 날짜의 약속을 띄움
          onClose={handleCloseCalendarModal}
          meet={selectedMeet}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
}

export default CalendarView;
