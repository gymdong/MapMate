import React, { useState } from "react";
import style from "./EditProfile.module.css";
import { v4 as uuidv4 } from "uuid";
import { storageService } from "fbase";
import { authService } from "fbase";
import { dbService } from "fbase";

function EditProfile({ onClose, changedUser }) {
  const [bio, setBio] = useState("간략한 자기소개를 적어주세요!"); //디폴트 바이오 변경값
  const [avatar, setAvatar] = useState("");

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };
  const handleSubmitAvatar = async (event) => {
    //프로필사진 변경시 DB에 저장하는 함수
    const attachmentRef = storageService
      .ref()
      .child(`${authService.currentUser.uid}/${uuidv4()}`);
    console.log(avatar);
    if (avatar == "") {
      console.log("not changed");
      onClose();
      return;
    }

    const response = await attachmentRef.putString(avatar, "data_url");
    const attachmentUrl = await response.ref.getDownloadURL();

    dbService
      .collection("user_info")
      .where("user_id", "==", authService.currentUser.uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // 해당 문서의 ref를 가져와서 업데이트
          dbService
            .collection("user_info")
            .doc(doc.id)
            .update({
              profile_picture: attachmentUrl,
              user_bio: bio,
            })
            .then(() => {
              console.log("프로필 사진 업데이트 성공");
              changedUser(bio);
              onClose();
            })
            .catch((error) => {
              console.error("프로필 사진 업데이트 오류:", error);
            });
        });
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
      });
    //console.log(response);

    // window.location.reload("/profile");
  };
  const handleAvatarChange = async (event) => {
    //미리보기를 위해
    const {
      target: { files },
    } = event;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAvatar(result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={style.modal_overlay}>
      <div className={style.modal}>
        <button className={style.close_modal_btn} onClick={onClose}>
          &times;
        </button>
        <h2>Edit Profile</h2>
        <div className={style.edit_profile_content}>
          <div className={style.avatar_section}>
            {avatar ? (
              <img className={style.profile_avatar} src={avatar} alt="Avatar" />
            ) : (
              <p className={style.profile_avatar_text}>사진을 선택해주세요.</p>
            )}
            <div className={style.inputBox}>
              <label>
                Upload Image
                <input
                  type="file"
                  onChange={handleAvatarChange}
                  accept="image/*"
                  required
                />
              </label>
            </div>
          </div>
          <div className={style.bio_section}>
            <textarea
              className={style.bio_input}
              value={bio}
              onChange={handleBioChange}
              rows="4"
            ></textarea>
          </div>
          <button className={style.save_button} onClick={handleSubmitAvatar}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
