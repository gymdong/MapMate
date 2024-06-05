import AppRouter from "components/Router";
import { useEffect } from "react";
import { useState } from "react";
import { authService } from "fbase";

const { kakao } = window;
function App() {
  console.log(authService.currentUser);
  const [isLoggedIn, setisLoggedIn] = useState(authService.currentUser);
  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);
  }, []);
  return (
    <div>
      <div id="container" style={{ width: "100%", height: "100%" }}>
        <p style={{ fontSize: 50, textAlign: "center" }}>Sample Page</p>
        <div id="map" style={{ width: 500, height: 400 }}></div>
        <AppRouter />
        <footer>&copy; {new Date().getFullYear()} asdf</footer>
      </div>
    </div>
  );
}

export default App;
