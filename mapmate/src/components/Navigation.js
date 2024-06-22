import { Link } from "react-router-dom";
import {
  FaHome,
  FaComment,
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
          {/* 사용할 아이콘 */}
          <Link to="/">
            <span>Home</span>
          </Link>
        </div>
        <div className={styles.menuView}>
          <FaComment style={{ fontSize: "2em", marginRight: "10px" }} />{" "}
          <Link to="/alert">
            <span>Alert</span>
          </Link>
        </div>
        <div className={styles.menuView}>
          <FaUserFriends style={{ fontSize: "2em", marginRight: "10spanx" }} />{" "}
          <Link to="/friend">
            <span>Friend</span>
          </Link>
        </div>
        <div className={styles.menuView}>
          <FaUserAlt style={{ fontSize: "2em", marginRight: "10px" }} />{" "}
          <Link to="/profile">
            <span>My Profile</span>
          </Link>
        </div>
        <div className={styles.menuView}>
          <FaCalendarCheck style={{ fontSize: "2em", marginRight: "10px" }} />{" "}
          <Link to="/calendar">
            <span>Calendar</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
export default Navigation;
