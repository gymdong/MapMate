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
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { useLocation } from "react-router-dom";
import InfoMenu from "./infoMenu";

const { kakao } = window;
function App() {
  console.log(authService.currentUser);
  const [init, setInit] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [selectLat, setSelectLat] = useState(0);
  const [selectLng, setSelectLng] = useState(0);
  const [currentLL, setCurrentLL] = useState({
    center: {
      lat: 33.45058,
      lng: 126.574942,
    },
    errMsg: null,
    isLoading: true,
    ispanto: false,
  });
  const handleOpenOverlay = () => {
    setIsOverlayOpen(true);
  };
  const handleUserData = (newData) => {
    setUserData(newData);
  };
  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
  };
  const handleCurrentLL = (state) => {
    setCurrentLL(state);
  };
  const location = useLocation();
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
    console.log(currentLL);
  }, []);
  const sendMeetInfo = async (event) => {
    event.preventDefault();
    var textareaContent = document.getElementById("subText").value;
    var meetData = document.getElementById("meet_start").value;
    var meetTime = document.getElementById("meet_time").value;

    await dbService.collection("meet_info").add({
      sendMessage: textareaContent,
      sendUser: authService.currentUser.displayName,
      sendUserid: authService.currentUser.uid,
      lat: selectLat,
      lng: selectLng,
      date: meetData,
      time: meetTime,
      member: [authService.currentUser.displayName],
    });
    console.log(authService.currentUser);
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
              <p className={style.headerText}>약속 장소와 날짜를 선택하세요!</p>
              <Map
                center={{
                  lat: currentLL.center.lat,
                  lng: currentLL.center.lng,
                }}
                style={{ width: "460px", height: "300px" }}
                onClick={(_, mouseEvent) => {
                  const latlng = mouseEvent.latLng;
                  setSelectLat(latlng.getLat());
                  setSelectLng(latlng.getLng());
                }}
              >
                <MapMarker position={{ lat: selectLat, lng: selectLng }} />
              </Map>
              <div>
                <input
                  type="date"
                  id="meet_start"
                  className={style.sendInput}
                />
                <input id="meet_time" type="time" className={style.sendInput} />
              </div>
              <textarea
                placeholder="약속 내용이 무엇인가요?"
                rows="4"
                id="subText"
                className={style.sendTextArea}
              ></textarea>

              <button className={style.submit_btn} onClick={sendMeetInfo}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      <div id="container">
        <SwitchTransition>
          <CSSTransition
            key={location.pathname} // 경로를 키로 사용
            classNames={{
              enter: style.fadeEnter,
              enterActive: style.fadeEnterActive,
              exit: style.fadeExit,
              exitActive: style.fadeExitActive,
            }}
            timeout={300}
          >
            <Routes location={location}>
              {isLoggedIn ? (
                <>
                  <Route
                    exact
                    path="/"
                    element={<Home handleCurrentLL={handleCurrentLL} />}
                  ></Route>
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
          </CSSTransition>
        </SwitchTransition>
        {isLoggedIn ? <></> : <Auth onDataChange={handleUserData} />}
      </div>
      <Sidebar width={320} isLoggedIn={isLoggedIn}>
        {init ? <AppRouter isLoggedIn={isLoggedIn} /> : "initializing..."}
        <div className={style.buttonContainer}>
          {isLoggedIn ? (
            <button onClick={handleOpenOverlay} className={style.submit_btn}>
              Create New Meeting
            </button>
          ) : (
            <InfoMenu />
          )}
        </div>
      </Sidebar>
    </div>
  );
}
//<footer>&copy; {new Date().getFullYear()} MapMate</footer>

export default App;
