import React, { useEffect, useRef, useState } from "react";
import styles from "./sidebar.module.css";
import { authService } from "fbase";
import { useNavigate } from "react-router-dom";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
const Sidebar = ({ width = 280, children, isLoggedIn }) => {
  const [isOpen, setOpen] = useState(true);
  const [xPosition, setX] = useState(width);
  const side = useRef();

  // button 클릭 시 토글
  const toggleMenu = () => {
    if (xPosition > 0) {
      setX(0);
      setOpen(true);
    } else {
      setX(width);
      setOpen(false);
    }
  };

  // 사이드바 외부 클릭시 닫히는 함수
  const handleClose = async (e) => {
    let sideArea = side.current;
    let sideCildren = side.current.contains(e.target);
    if (isOpen && (!sideArea || !sideCildren)) {
      await setX(width);
      await setOpen(false);
    }
  };
  const navigate = useNavigate();

  const onLogOutClick = () => {
    navigate("/");
    authService.signOut();
  };
  useEffect(() => {
    window.addEventListener("click", handleClose);
    return () => {
      window.removeEventListener("click", handleClose);
    };
  });

  return (
    <div className={styles.container}>
      <div
        ref={side}
        className={styles.sidebar}
        style={{
          width: `${width}px`,
          height: "100%",
          transform: `translatex(${-xPosition}px)`,
        }}
      >
        <button onClick={() => toggleMenu()} className={styles.button}>
          {isOpen ? (
            <FaAngleDoubleLeft
              style={{
                fontSize: "15px",
              }}
            />
          ) : (
            <FaAngleDoubleRight
              style={{
                fontSize: "15px",
              }}
            />
          )}
        </button>

        <div className={styles.content}>
          <span className={styles.menuText}>Menu</span>
        </div>
        {children}
        <div className={styles.buttonContainer}>
          {isLoggedIn ? (
            <button onClick={onLogOutClick} className={styles.log_out_button}>
              Log Out
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
