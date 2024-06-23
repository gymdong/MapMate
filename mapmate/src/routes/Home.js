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
  const [state, setState] = useState({
    center: {
      lat: 33.450701,
      lng: 126.570667,
    },
    errMsg: null,
    isLoading: true,
    ispanto: false,
  });

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
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude, // 위도
              lng: position.coords.longitude, // 경도
            },
            isLoading: false,
          }));
        },
        (err) => {
          setState((prev) => ({
            ...prev,
            errMsg: err.message,
            isLoading: false,
          }));
        }
      );
    } else {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
      setState((prev) => ({
        ...prev,
        errMsg: "geolocation을 사용할수 없어요..",
        isLoading: false,
      }));
    }
    console.log(state);
  }, []);

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
    <div style={{ width: "85vw", height: "85vh" }}>
      <Map
        center={state.center}
        style={{ width: "100%", height: "100%" }}
        ispanto={state.ispanto}
        level={6}
      >
        <MapMarker position={state.center}>
          <div style={{ padding: "5px", color: "#000" }}>
            {state.errMsg ? state.errMsg : "여기에 계신가요?!"}
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
