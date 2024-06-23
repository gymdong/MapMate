import { Link } from "react-router-dom";
import {
  FaHome,
  FaRegCommentDots,
  FaQuestionCircle,
  FaRegSmile,
  FaCalendarCheck,
} from "react-icons/fa"; // 예시로 Font Awesome 아이콘 사용
import styles from "./infoMenu.module.css";

const InfoMenu = () => {
  const onDivClick = () => {
    alert("추후 지원 예정입니다!");
  };
  return (
    <div className={styles.menuContainer}>
      <div className={styles.menuView}>
        <FaHome
          style={{ fontSize: "27px", marginRight: "10px", marginTop: "10px" }}
        />{" "}
        {/* 사용할 아이콘 */}
        <div className={styles.menuLinkBox} onClick={onDivClick}>
          <span className={styles.menuText}>주요 기능</span>
        </div>
      </div>
      <div className={styles.menuView}>
        <FaRegCommentDots
          style={{ fontSize: "27px", marginRight: "10px", marginTop: "10px" }}
        />{" "}
        <div className={styles.menuLinkBox} onClick={onDivClick}>
          <span className={styles.menuText}>사용자 리뷰</span>
        </div>
      </div>

      <div className={styles.menuView}>
        <FaQuestionCircle
          style={{ fontSize: "27px", marginRight: "10px", marginTop: "10px" }}
        />{" "}
        <div className={styles.menuLinkBox} onClick={onDivClick}>
          <span className={styles.menuText}>FAQ</span>
        </div>
      </div>
      <div className={styles.menuView}>
        <FaRegSmile
          style={{ fontSize: "27px", marginRight: "10px", marginTop: "10px" }}
        />{" "}
        <div className={styles.menuLinkBox} onClick={onDivClick}>
          <span className={styles.menuText}>연락처</span>
        </div>
      </div>
    </div>
  );
};
export default InfoMenu;
