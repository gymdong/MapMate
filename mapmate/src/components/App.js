import AppRouter from "components/Router";
import { useEffect } from "react";
import { useState, useRef } from "react";
import { authService } from "fbase";
import Sidebar from "./sidebar";
import style from "./home.module.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Friend from "routes/Friend";
import Alert from "routes/Alert";
import CalendarView from "routes/Calendar";
import { dbService } from "fbase";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";

const { kakao } = window;
function App() {
  console.log(authService.currentUser);
  const [init, setInit] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [selectLat, setSelectLat] = useState(0);
  const [selectLng, setSelectLng] = useState(0);
  const handleOpenOverlay = () => {
    setIsOverlayOpen(true);
  };
  const handleUserData = (newData) => {
    setUserData(newData);
  };
  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
  };
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        setisLoggedIn(user);
      } else {
        setisLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  const sendMeetInfo = async (event) => {
    event.preventDefault();
    var textareaContent = document.getElementById("subText").value;
    var meetData = document.getElementById("meet_start").value;
    var meetTime = document.getElementById("meet_time").value;

    await dbService.collection("meet_info").add({
      sendMessage: textareaContent,
      sendUser: authService.currentUser.displayName,
      lat: selectLat,
      lng: selectLng,
      date: meetData,
      time: meetTime,
      member: [authService.currentUser.displayName],
    });
    handleCloseOverlay();
  };
  /*useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);
  }, []);*/
  {
    /*<p style={{ fontSize: 50, textAlign: "center" }}>Sample Page</p>
        <div id="map" style={{ width: 500, height: 400 }}></div>*/
  }
  return (
    <div
      style={{ width: "100%", minHeight: "100vh" }}
      className={style.container}
    >
      {isOverlayOpen && (
        <div className={style.modal_overlay}>
          <div className={style.modal}>
            <button
              className={style.close_modal_btn}
              onClick={handleCloseOverlay}
            >
              &times;
            </button>
            <div className={style.modal_content}>
              <p>약속 장소와 날짜를 선택하세요!</p>
              <Map
                center={{ lat: 33.5563, lng: 126.79581 }}
                style={{ width: "400px", height: "300px" }}
                onClick={(_, mouseEvent) => {
                  const latlng = mouseEvent.latLng;
                  setSelectLat(latlng.getLat());
                  setSelectLng(latlng.getLng());
                }}
              >
                <MapMarker position={{ lat: selectLat, lng: selectLng }} />
              </Map>
              <div>
                <input type="date" id="meet_start" />
                <input id="meet_time" type="time" />
              </div>
              <textarea
                placeholder="약속 내용이 무엇인가요?"
                rows="4"
                id="subText"
              ></textarea>

              <button className={style.submit_btn} onClick={sendMeetInfo}>
                전송
              </button>
            </div>
          </div>
        </div>
      )}
      <BrowserRouter>
        <div id="container">
          <Routes>
            {isLoggedIn ? (
              <>
                <Route exact path="/" element={<Home />}></Route>
                <Route exact path="/friend" element={<Friend />}></Route>
                <Route exact path="/alert" element={<Alert />}></Route>
                <Route
                  exact
                  path="/profile"
                  element={<Profile userData={userData} />}
                ></Route>
                <Route
                  exact
                  path="/calendar"
                  element={<CalendarView />}
                ></Route>
              </>
            ) : (
              <Route exact path="/" element={<></>}></Route>
            )}
          </Routes>
          {isLoggedIn ? <></> : <Auth onDataChange={handleUserData} />}
        </div>
        <Sidebar width={320}>
          {init ? <AppRouter isLoggedIn={isLoggedIn} /> : "initializing..."}
          <button onClick={handleOpenOverlay} className={style.submit_btn}>
            새 약속 만들기
          </button>
        </Sidebar>
      </BrowserRouter>
    </div>
  );
}
//<footer>&copy; {new Date().getFullYear()} MapMate</footer>

export default App;
