import { authService, dbService, firebaseInstance } from "fbase";
import { useState } from "react";

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
    await dbService.collection("user_info").add({
      user_email: data.user.email,
      user_id: data.user.uid,
      user_name: data.user.displayName,
    });
    onDataChange(data.user);
    console.log(data.user);
  };
  return (
    <div>
      <form
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
      </form>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <button onClick={onSocialClick} name="google">
          Google Log In
        </button>

        <button onClick={onSocialClick} name="Kakao">
          Kakao Log In
        </button>
      </div>
    </div>
  );
};

export default Auth;
