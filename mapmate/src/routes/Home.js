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
  const [conditionResults, setConditionResults] = useState([]); // 조건 결과 저장
  const [state, setState] = useState({
    //초기값은 제주도
    center: {
      lat: 33.45058,
      lng: 126.574942,
    },
    errMsg: null,
    isLoading: true,
    ispanto: false,
  });

  const getFormattedDate = () => {
    //날짜 포매팅 함수
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 필요
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };
  const clickMarker = (item) => {
    //해당 위치 약속 정보를 띄울 함수
    setSelectedItem(item);
    console.log(selectedItem);
    setIsHomeModalOpen(true);
  };
  const checkFollowingStatus = async (data) => {
    //팔로잉 하고 있는 대상의 약속인지 검사
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
      //검사 완료 후 Promise.resolve로 반환
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
        mid: document.id, //각 약속의 고유 ID 받아오는 부분
        ...document.data(),
      }));
      setMeets(newArray);
    });
    setIsMountFinished(true);
  }, []);
  useEffect(() => {
    const checkAllConditions = async () => {
      //약속마다 팔로잉 여부가 저장된 배열
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
      // GeoLocation을 이용해서 접속 위치를 얻어옴
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
      //  GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정
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
        <Map //메인 지도 생성. 중심은 현위치
          center={{ lat: state.center.lat, lng: state.center.lng }}
          style={{ width: "100%", height: "100%" }}
          ispanto={state.ispanto}
          level={4}
        >
          <MapMarker //현 위치를 보여주는 마커
            position={state.center}
            infoWindowOptions={{ disableAutoPan: true }}
          >
            <div style={{ padding: "5px", color: "#000" }}>
              {state.errMsg ? state.errMsg : "현재 위치입니다!"}
            </div>
          </MapMarker>
          {meets.length > 1 &&
            meets.map((item, idx) => {
              //각각의 약속을 마커+인포윈도우로 띄우는 뷰
              const meetDate = item.date;
              const todayDate = getFormattedDate();
              const meetDateObj = new Date(meetDate);
              const todayDateobj = new Date(todayDate);

              if (
                meetDateObj.getTime() >= todayDateobj.getTime() &&
                (conditionResults[idx] ||
                  item.sendUserid == authService.currentUser.uid)
              ) {
                return (
                  <MapMarker
                    position={{
                      // 인포윈도우가 표시될 위치
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
                      <span>{item.sendMessage.substring(0, 7) + "..."}</span>
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
