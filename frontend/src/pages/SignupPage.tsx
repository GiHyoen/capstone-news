import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const validatePassword = (pwd: string) => {
    return pwd.length >= 8 && /[!@#$%^&*]/.test(pwd);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password || !passwordConfirm) {
      setErrorMessage("모든 항목을 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage("비밀번호는 8자 이상이며 특수문자를 포함해야 합니다.");
      return;
    }

    try {
      // 아이디 중복 체크
      await axios.get("http://localhost:8080/api/user/check-username", {
        params: { username },
        withCredentials: true
      });

      // 회원가입 요청
      await axios.post(
        "http://localhost:8080/api/user/signup",
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );

      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      navigate("/login");

    } catch (err: any) {
      if (err.response?.status === 409) {
        setErrorMessage("이미 존재하는 아이디입니다.");
      } else {
        setErrorMessage("회원가입 실패: " + (err.response?.data || err.message));
      }
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>회원가입</h2>

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

          {errorMessage && <p style={styles.error}>{errorMessage}</p>}

          <button type="submit" style={styles.button}>회원가입</button>
        </form>

        <p style={styles.bottomText}>
          이미 계정이 있으신가요? <a href="/login" style={styles.link}>로그인</a>
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
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    width: "100%",
    maxWidth: "360px",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "24px",
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
  error: {
    color: "red",
    fontSize: "13px",
    marginBottom: "12px",
  },
  bottomText: {
    marginTop: "20px",
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