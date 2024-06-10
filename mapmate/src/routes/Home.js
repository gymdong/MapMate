import { useEffect } from "react";
import { useState, useRef } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import { Link } from "react-router-dom";

const { kakao } = window;
const Home = () => {
  {
    /*useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);
  }, []);
  <div id="map" style={{ width: 300, height: 200 }}></div>*/
  }
  return (
    <div>
      <p>홈 화면입니다!</p>
      <Map
        center={{ lat: 33.5563, lng: 126.79581 }}
        style={{ width: "1200px", height: "600px" }}
      >
        <MapMarker
          position={{
            // 인포윈도우가 표시될 위치입니다
            lat: 33.450701,
            lng: 126.570667,
          }}
        >
          <div
            style={{
              padding: "5px",
              color: "#000",
            }}
          >
            I'm here! <br />
            <a
              href="https://map.kakao.com/link/map/Hello World!,33.450701,126.570667"
              style={{ color: "blue" }}
              target="_blank"
              rel="noreferrer"
            >
              Profile
            </a>{" "}
            <Link to="/friend">Message</Link>
          </div>
        </MapMarker>
      </Map>
    </div>
  );
};

export default Home;
