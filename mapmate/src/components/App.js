import AppRouter from "components/Router";
import { useEffect } from "react";
import { useState, useRef } from "react";
import { authService } from "fbase";
import Sidebar from "./sidebar";
import style from "./home.module.css";

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
  return (
    <div
      style={{ width: "100%", minHeight: "100vh" }}
      className={style.container}
    >
      <div id="container">
        <p className={style.headerText}>MapMate</p>
        {/*<p style={{ fontSize: 50, textAlign: "center" }}>Sample Page</p>
        <div id="map" style={{ width: 500, height: 400 }}></div>*/}
        {init ? <AppRouter isLoggedIn={isLoggedIn} /> : "initializing..."}
        <footer>&copy; {new Date().getFullYear()} MapMate</footer>
      </div>
      <Sidebar width={320}>
        <span>여기에 메뉴 구성하기</span>
      </Sidebar>
    </div>
  );
}

export default App;
