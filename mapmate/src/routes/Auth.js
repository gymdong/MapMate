import { authService, dbService, firebaseInstance } from "fbase";
import { useState } from "react";
import bannerImage from "./banner.png";
import "./Auth.css"; // CSS 파일 임포트

const Auth = ({ onDataChange }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    try {
      let data;
      event.preventDefault();
      if (newAccount) {
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
      } else {
        data = await authService.signInWithEmailAndPassword(email, password);
        //log in
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);
  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    }
    const data = await authService.signInWithPopup(provider);
    const { user } = data;

    const userRef = dbService
      .collection("user_info")
      .where("user_email", "==", user.email);
    const snapshot = await userRef.get();
    if (snapshot.empty) {
      // 해당 이메일이 데이터베이스에 없을 경우에만 추가
      await dbService.collection("user_info").add({
        user_email: user.email,
        user_id: user.uid,
        user_name: user.displayName,
      });
      console.log("사용자 정보 추가 완료");
    } else {
      console.log("이미 존재하는 이메일입니다.");
    }
    // await dbService.collection("user_info").add({
    //   user_email: data.user.email,
    //   user_id: data.user.uid,
    //   user_name: data.user.displayName,
    // });
    onDataChange(data.user);
    console.log(data.user);
  };
  return (
    <div>
      <div className="image-container">
        <img
          src={bannerImage}
          style={{ width: "98vw", height: "98vh" }}
          alt="배너"
          className="banner"
        ></img>
        <div className="box">
          {/* 여기에 박스 내용 추가 */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <button onClick={onSocialClick} name="google">
              구글로 시작하기!
            </button>

            <button onClick={onSocialClick} name="Kakao">
              카카오로 시작하기!
            </button>
          </div>
        </div>
      </div>
      {/*<form 여기는 일반 로그인인데 일단 주석처리하고 구글로만 로그인하게
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={onChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={onChange}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <input
            type="submit"
            value={newAccount ? "Create Account" : "Log In"}
          />
          <button onClick={toggleAccount}>
            {newAccount ? "Sign in" : "Creat Account"}
          </button>
        </div>
        {error}
      </form>*/}
    </div>
  );
};

export default Auth;
