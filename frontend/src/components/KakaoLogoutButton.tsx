// src/components/KakaoLogoutButton.tsx
import React from "react";
import axios from "axios";

const KakaoLogoutButton: React.FC = () => {
  const logoutFromKakao = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("로그인 상태가 아닙니다.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/kakao/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      alert("카카오 로그아웃 완료");
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    } catch (err) {
      console.error("카카오 로그아웃 실패", err);
      alert("로그아웃 실패");
    }
  };

  return (
    <button onClick={logoutFromKakao} style={styles.button}>
      카카오 연결 해제 (로그아웃)
    </button>
  );
};

const styles = {
  button: {
    backgroundColor: "#FEE500",
    color: "#000",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
};

export default KakaoLogoutButton;
