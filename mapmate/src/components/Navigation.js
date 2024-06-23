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
  return (
    <nav>
      <div>
        <div className={styles.menuView}>
          <FaHome
            style={{ fontSize: "33px", marginRight: "10px", marginTop: "10px" }}
          />{" "}
          {/* 사용할 아이콘 */}
          <Link to="/" className={styles.menuLinkBox}>
            <span className={styles.menuText}>Home</span>
          </Link>
        </div>
        <div className={styles.menuView}>
          <FaBell
            style={{ fontSize: "33px", marginRight: "10px", marginTop: "10px" }}
          />{" "}
          <Link to="/alert" className={styles.menuLinkBox}>
            <span className={styles.menuText}>Notifications</span>
          </Link>
        </div>
        <div className={styles.menuView}>
          <FaCalendarCheck
            style={{ fontSize: "33px", marginRight: "10px", marginTop: "10px" }}
          />{" "}
          <Link to="/calendar" className={styles.menuLinkBox}>
            <span className={styles.menuText}>Calendar</span>
          </Link>
        </div>
        <div className={styles.menuView}>
          <FaUserFriends
            style={{ fontSize: "33px", marginRight: "10px", marginTop: "10px" }}
          />{" "}
          <Link to="/friend" className={styles.menuLinkBox}>
            <span className={styles.menuText}>Friend</span>
          </Link>
        </div>
        <div className={styles.menuView}>
          <FaUserAlt
            style={{ fontSize: "33px", marginRight: "10px", marginTop: "10px" }}
          />{" "}
          <Link to="/profile" className={styles.menuLinkBox}>
            <span className={styles.menuText}>My Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
export default Navigation;
