import { useState } from "react";
import axios from "axios";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/signup", null, {
        params: { username, password },
        withCredentials: false,
      });
      alert("회원가입 성공!");
    } catch (err: any) {
      alert("회원가입 실패: " + (err.response?.data || err.message));
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* ✅ 중앙 정렬 강제 적용 */}
        <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "24px", margin: "0 auto" }}>
  회원가입
</h2>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>회원가입</button>
        </form>

        <p style={styles.bottomText}>
          이미 계정이 있으신가요?{" "}
          <a href="/login" style={styles.link}>로그인</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    backgroundColor: "#f0f4f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    boxSizing: "border-box",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px",
    width: "100%",
    maxWidth: "360px",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    display: "flex", // ✅ 카드 안에서도 중앙 정렬되도록
    flexDirection: "column",
    alignItems: "center", // ✅ 카드 내부 모든 항목 수평 중앙 정렬
  },
  title: {
    fontSize: "22px",
    marginBottom: "24px",
    fontWeight: "bold",
    textAlign: "center" as const, // ✅ 추가
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "16px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#d5def5",
    color: "#000",
    fontWeight: "bold",
    fontSize: "15px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    marginTop: "10px",
  },
  bottomText: {
    marginTop: "20px",
    textAlign: "center" as const,
    fontSize: "14px",
    color: "#666",
  },
  link: {
    textDecoration: "none",
    color: "#6c88f1",
    fontWeight: "bold",
  },
} as const;

export default SignupPage;