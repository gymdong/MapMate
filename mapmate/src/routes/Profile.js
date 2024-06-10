import { authService } from "fbase";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };
  return (
    <div>
      <p>프로필입니다!</p>
      <button onClick={onLogOutClick}>Log Out</button>
    </div>
  );
};

export default Profile;
