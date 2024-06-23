import { Link } from "react-router-dom";
import {
  FaHome,
  FaBell,
  FaUserFriends,
  FaUserAlt,
  FaCalendarCheck,
} from "react-icons/fa"; // 예시로 Font Awesome 아이콘 사용
import styles from "./Navigation.module.css";

const Navigation = () => {
  //로그인시 보여줄 뷰들. 실제로 Link로 이동하는 부분
  return (
    <nav>
      <div>
        <Link to="/" className={styles.menuLinkBox}>
          <div className={styles.menuView}>
            <FaHome
              style={{
                fontSize: "33px",
                marginRight: "10px",
                marginTop: "10px",
              }}
            />{" "}
            {/* 사용할 아이콘 */}
            <span className={styles.menuText}>Home</span>
          </div>
        </Link>
        <Link to="/alert" className={styles.menuLinkBox}>
          <div className={styles.menuView}>
            <FaBell
              style={{
                fontSize: "33px",
                marginRight: "10px",
                marginTop: "10px",
              }}
            />{" "}
            <span className={styles.menuText}>Notifications</span>
          </div>
        </Link>
        <Link to="/calendar" className={styles.menuLinkBox}>
          <div className={styles.menuView}>
            <FaCalendarCheck
              style={{
                fontSize: "33px",
                marginRight: "10px",
                marginTop: "10px",
              }}
            />{" "}
            <span className={styles.menuText}>Calendar</span>
          </div>
        </Link>
        <Link to="/friend" className={styles.menuLinkBox}>
          <div className={styles.menuView}>
            <FaUserFriends
              style={{
                fontSize: "33px",
                marginRight: "10px",
                marginTop: "10px",
              }}
            />{" "}
            <span className={styles.menuText}>Friend</span>
          </div>
        </Link>
        <Link to="/profile" className={styles.menuLinkBox}>
          <div className={styles.menuView}>
            <FaUserAlt
              style={{
                fontSize: "33px",
                marginRight: "10px",
                marginTop: "10px",
              }}
            />{" "}
            <span className={styles.menuText}>My Profile</span>
          </div>
        </Link>
      </div>
    </nav>
  );
};
export default Navigation;
