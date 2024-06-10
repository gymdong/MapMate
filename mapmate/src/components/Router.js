import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "./Navigation";
import Friend from "routes/Friend";
import Alert from "routes/Alert";
const AppRouter = ({ isLoggedIn }) => {
  return <div>{isLoggedIn && <Navigation />}</div>;
};
export default AppRouter;
{
  /*<Router>
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
  </Router>*/
}
