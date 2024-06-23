import { dbService } from "fbase";
import { useEffect } from "react";
import { useState, useRef } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import { Link } from "react-router-dom";
import HomeModal from "./HomeModal";
import { authService } from "fbase";
const { kakao } = window;
const Home = ({ handleCurrentLL }) => {
  const [meets, setMeets] = useState([]);
  const [isHomeModalOpen, setIsHomeModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const [isMountFinished, setIsMountFinished] = useState(false);
  const [setRetVal, setSetRetVal] = useState(true);
  const [conditionResults, setConditionResults] = useState([]); // 조건 결과 저장
  const [state, setState] = useState({
    center: {
      lat: 33.45058,
      lng: 126.574942,
    },
    errMsg: null,
    isLoading: true,
    ispanto: false,
  });

  const getFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 필요
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const clickMarker = (item) => {
    setSelectedItem(item);
    console.log(selectedItem);
    setIsHomeModalOpen(true);
  };
  const checkFollowingStatus = async (data) => {
    if (!data) {
      console.error("error occured");
      return await Promise.resolve(false);
    }
    const currentUser = authService.currentUser;
    const querySnapshot = await dbService
      .collection("user_info")
      .where("user_id", "==", data.sendUserid)
      .get();

    let uEmail;
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const userInfo = doc.data();
        const userEmail = userInfo.user_email;
        uEmail = userEmail;
      });
    }

    if (currentUser) {
      console.log(uEmail);
      const followQuery = await dbService
        .collection("follow_info")
        .where("sender", "==", currentUser.email)
        .where("receiver", "==", uEmail)
        .get();
      followQuery.forEach((val) => {
        console.log(val.data());
      });
      if (!followQuery.empty) {
        return await Promise.resolve(true);
      } else {
        return await Promise.resolve(false);
      }
    }
  };
  useEffect(() => {
    dbService.collection("meet_info").onSnapshot((snapshot) => {
      const newArray = snapshot.docs.map((document) => ({
        mid: document.id,
        ...document.data(),
      }));
      setMeets(newArray);
    });
    //console.log(meets);
    setIsMountFinished(true);
  }, []);
  useEffect(() => {
    const checkAllConditions = async () => {
      const results = await Promise.all(
        meets.map(async (val) => {
          if (val !== undefined && val !== null) {
            return await checkFollowingStatus(val);
          } else {
            console.error("Invalid meet value:", val);
            return false;
          }
        })
      );
      setConditionResults(results);
    };

    checkAllConditions();
  }, [meets]);
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
  useEffect(() => {
    handleCurrentLL(state);
    console.log(state);
  }, [state]);
  const handleCloseHomeModal = () => {
    setIsHomeModalOpen(false);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {isMountFinished && (
        <Map
          center={{ lat: state.center.lat, lng: state.center.lng }}
          style={{ width: "100%", height: "100%" }}
          ispanto={state.ispanto}
          level={6}
        >
          <MapMarker
            position={state.center}
            infoWindowOptions={{ disableAutoPan: true }}
          >
            <div style={{ padding: "5px", color: "#000" }}>
              {state.errMsg ? state.errMsg : "현재 위치입니다!"}
            </div>
          </MapMarker>
          {meets.length > 1 &&
            meets.map((item, idx) => {
              const meetDate = item.date;
              const todayDate = getFormattedDate();
              const meetDateObj = new Date(meetDate);
              const todayDateobj = new Date(todayDate);
              // let fs;
              // checkFollowingStatus(item).then((followstatus) => {
              //   fs = followstatus;
              // });

              if (
                meetDateObj.getTime() >= todayDateobj.getTime() &&
                (conditionResults[idx] ||
                  item.sendUserid == authService.currentUser.uid)
              ) {
                //여기 조건 수정
                return (
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
                    infoWindowOptions={{ disableAutoPan: true }}
                  >
                    <div
                      style={{
                        padding: "5px",
                        color: "#000",
                      }}
                    >
                      {item.sendMessage.substring(0, 8) + "..."}
                    </div>
                  </MapMarker>
                );
              } else {
                return <></>;
              }
            })}
        </Map>
      )}
      {isHomeModalOpen && (
        <HomeModal onClose={handleCloseHomeModal} item={selectedItem} />
      )}
    </div>
  );
};

export default Home;
