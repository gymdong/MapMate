import { dbService } from "fbase";
import { useEffect } from "react";
import { useState, useRef } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import { Link } from "react-router-dom";
import HomeModal from "./HomeModal";
const { kakao } = window;
const Home = () => {
  const [meets, setMeets] = useState([]);
  const [isHomeModalOpen, setIsHomeModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [userLat, setUserLat] = useState(33.5563);
  const [userLng, setUserLng] = useState(126.79581);

  const clickMarker = (item) => {
    setSelectedItem(item);
    console.log(selectedItem);
    setIsHomeModalOpen(true);
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
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      getPosSuccess,
      () => alert("위치 정보를 가져오는데 실패했습니다."),
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000,
      }
    );
  }, []);
  const getPosSuccess = (pos) => {
    // 현재 위치(위도, 경도) 가져온다.
    setUserLat(pos.coords.latitude);
    setUserLng(pos.coords.longitude);
  };
  const handleCloseHomeModal = () => {
    setIsHomeModalOpen(false);
  };
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
    <div style={{ width: "95vw", height: "95vh" }}>
      <Map
        center={{ lat: userLat, lng: userLng }}
        style={{ width: "100%", height: "100%" }}
      >
        <MapMarker
          position={{
            // 인포윈도우가 표시될 위치입니다
            lat: userLat,
            lng: userLng,
          }}
          clickable={true}
        >
          <div
            style={{
              padding: "5px",
              color: "#000",
            }}
          >
            내 위치
          </div>
        </MapMarker>
        {meets.length > 1 &&
          meets.map((item, idx) => (
            <MapMarker
              position={{
                // 인포윈도우가 표시될 위치입니다
                lat: item.lat,
                lng: item.lng,
              }}
              clickable={true}
              onClick={() => {
                clickMarker(item);
              }}
            >
              <div
                style={{
                  padding: "5px",
                  color: "#000",
                }}
              >
                {item.sendMessage}
              </div>
            </MapMarker>
          ))}
      </Map>
      {isHomeModalOpen && (
        <HomeModal onClose={handleCloseHomeModal} item={selectedItem} />
      )}
    </div>
  );
};

export default Home;
