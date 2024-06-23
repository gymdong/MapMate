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
  const [init, setInit] = useState(false); //초기화 되고 나서 렌더링 하기 위해
  const [isLoggedIn, setisLoggedIn] = useState(false); //로그인여부 확인
  const [isOverlayOpen, setIsOverlayOpen] = useState(false); // 모달창
  const [userData, setUserData] = useState({}); //내 정보, 코드 리팩토링시 이 값을 하위 컴포넌트로 전달하게 변경
  const [selectLat, setSelectLat] = useState(0); //선택한 위도, 경도값
  const [selectLng, setSelectLng] = useState(0);
  const [currentLL, setCurrentLL] = useState({
    //최근의 위도, 경도값, default는 제주도로 설정
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
      //DB에 약속을 추가하는 부분
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
                  lng: currentLL.center.lng, //지도 중심은 현위치로 설정
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
          <CSSTransition //부드러운 화면 전환을 위한 태그들
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
              {isLoggedIn ? ( //Route를 이용해 화면 부드러운 전환
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
          {isLoggedIn ? ( //약속 생성하는 부분
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

export default App;
