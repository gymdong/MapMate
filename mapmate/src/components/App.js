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
const { kakao } = window;
function App() {
  console.log(authService.currentUser);
  const [init, setInit] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);
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
      <BrowserRouter>
        <div id="container">
          {!isLoggedIn ? <p className={style.headerText}>MapMate</p> : <></>}
          <Routes>
            {isLoggedIn ? (
              <>
                <Route exact path="/" element={<Home />}></Route>
                <Route exact path="/friend" element={<Friend />}></Route>
                <Route exact path="/alert" element={<Alert />}></Route>
                <Route exact path="/profile" element={<Profile />}></Route>
              </>
            ) : (
              <Route exact path="/" element={<></>}></Route>
            )}
          </Routes>
          {isLoggedIn ? <></> : <Auth />}
        </div>
        <Sidebar width={320}>
          <span>여기에 메뉴 구성하기</span>
          {init ? <AppRouter isLoggedIn={isLoggedIn} /> : "initializing..."}
        </Sidebar>
      </BrowserRouter>
    </div>
  );
}
//<footer>&copy; {new Date().getFullYear()} MapMate</footer>

export default App;
