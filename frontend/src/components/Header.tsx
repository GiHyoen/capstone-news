import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

function Header() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/user/me", { withCredentials: true })
      .then((res) => {
        const { name, username } = res.data;
        setUsername(name || username || "사용자");
      })
      .catch(() => {
        setUsername(null);
      });
  }, []);

  const handleLogout = () => {
    window.location.href = "http://localhost:8080/logout"; // Spring Security logout
  };

  return (
    <header style={styles.header}>
      <a href="/" style={styles.logo}>Issue Insight</a>
      <nav style={styles.nav}>
        <a href="/" style={styles.link}>홈</a>
        <a href="/world" style={styles.link}>세계</a>
        <a href="/politics" style={styles.link}>정치</a>
        <a href="/economy" style={styles.link}>경제</a>

        {username ? (
          <div style={styles.userSection}>
            <span style={styles.greeting}>반갑습니다, {username}님</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>로그아웃</button>
          </div>
        ) : (
          <a href="/login" style={styles.link}>로그인</a>
        )}

        <FaSearch style={styles.searchIcon} />
      </nav>
    </header>
  );
}

const styles = {
  header: {
    width: "100%",
    height: "50px",
    backgroundColor: "#4f71d6",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 24px",
    fontWeight: "bold",
    fontSize: "14px",
    position: "fixed" as const,
    top: 0,
    left: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#fff",
    textDecoration: "none",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  greeting: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: "14px",
  },
  logoutBtn: {
    background: "none",
    border: "1px solid white",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },
  searchIcon: {
    fontSize: "20px",
    color: "#fff",
    cursor: "pointer",
  },
} as const;

export default Header;