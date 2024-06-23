import { Link } from "react-router-dom";
import {
  FaHome,
  FaBell,
  FaUserFriends,
  FaUserAlt,
  FaCalendarCheck,
} from "react-icons/fa"; // 예시로 Font Awesome 아이콘 사용
import styles from "./Navigation.module.css";

const InfoMenu = () => {
  return (
    <div className={styles.menuContainer}>
      <div className={styles.menuView}>
        <FaHome
          style={{ fontSize: "20px", marginRight: "10px", marginTop: "10px" }}
        />{" "}
        {/* 사용할 아이콘 */}
        <div className={styles.menuLinkBox}>
          <span className={styles.menuText}>주요 기능</span>
        </div>
      </div>
      <div className={styles.menuView}>
        <FaBell
          style={{ fontSize: "20px", marginRight: "10px", marginTop: "10px" }}
        />{" "}
        <div className={styles.menuLinkBox}>
          <span className={styles.menuText}>사용자 리뷰</span>
        </div>
      </div>

      <div className={styles.menuView}>
        <FaUserFriends
          style={{ fontSize: "20px", marginRight: "10px", marginTop: "10px" }}
        />{" "}
        <div className={styles.menuLinkBox}>
          <span className={styles.menuText}>FAQ</span>
        </div>
      </div>
      <div className={styles.menuView}>
        <FaUserAlt
          style={{ fontSize: "20px", marginRight: "10px", marginTop: "10px" }}
        />{" "}
        <div className={styles.menuLinkBox}>
          <span className={styles.menuText}>연락처</span>
        </div>
      </div>
    </div>
  );
};
export default InfoMenu;
