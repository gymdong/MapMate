import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css"; // 모듈 CSS 파일 임포트
import { dbService, authService } from "fbase";
const appointments = [
  { date: "2024-06-21", title: "Meeting with John" },
  { date: "2024-06-22", title: "Dentist appointment" },
  // 추가 약속 데이터
]; //여기에 데이터 받아와서 넣으면 될듯.

function CalendarView() {
  const [meets, setMeets] = useState([]);
  const [value, setValue] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateClick = (date) => {
    setSelectedDate(date);
    // 클릭한 날짜에 대한 추가적인 작업 수행
    console.log("Clicked date:", selectedDate);
  };
  useEffect(() => {
    dbService.collection("meet_info").onSnapshot((snapshot) => {
      const newArray = snapshot.docs.map((document) => ({
        mid: document.id,
        ...document.data(),
      }));
      setMeets(newArray);
    });
    console.log(meets);
  }, []);

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const appointment = meets.find(
        (appointment) =>
          new Date(appointment.date).toDateString() === date.toDateString()
      );
      return appointment ? <div className="appointment"></div> : null;
    }
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={setValue}
        value={value}
        tileContent={tileContent}
        className="react-calendar"
        onClickDay={handleDateClick}
      />
    </div>
  );
}

export default CalendarView;
