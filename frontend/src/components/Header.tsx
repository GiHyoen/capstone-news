import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

interface UserResponse {
  name?: string;
  username?: string;
  nickname?: string;
  properties?: { nickname?: string };       // 카카오
  response?: { nickname?: string };         // 네이버
  kakao_account?: { profile?: { nickname?: string } }; // 카카오 v2
}

function Header() {
  const [username, setUsername] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user/me", { withCredentials: true })
      .then((res) => {
        console.log("✅ /api/user/me 응답:", res.data); 
        const data = res.data as UserResponse; // ✅ 타입 단언 추가

        const username =
          data.properties?.nickname ||                    // 카카오
          data.response?.nickname ||                      // 네이버
          data.kakao_account?.profile?.nickname ||        // 카카오 v2
          data.nickname ||                                // 기타
          data.name ||                                    // 일반 로그인
          data.username ||                                // 일반 로그인
          "사용자";

        setUsername(username);
      })
      .catch(() => {
        setUsername(null);
      });
  }, []);

  const handleLogout = () => {
    window.location.href = "http://localhost:8080/logout";
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/news?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header style={styles.header}>
      <a href="/" style={styles.logo}>Issue Insight</a>
      <nav style={styles.nav}>
        <a href="/" style={styles.link}>홈</a>
        <a href="/world" style={styles.link}>세계</a>
        <a href="/politics" style={styles.link}>정치</a>
        <a href="/economy" style={styles.link}>경제</a>

        <div style={styles.searchContainer}>
          <input
            type="text"
            value={query}
            placeholder="뉴스 검색"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={styles.searchInput}
          />
          <FaSearch style={styles.searchIcon} onClick={handleSearch} />
        </div>

        <div style={styles.userSection}>
          {username ? (
            <>
              <span style={styles.greeting}>반갑습니다, {username}님</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>로그아웃</button>
            </>
          ) : (
            <a href="/login" style={styles.link}>로그인</a>
          )}
        </div>
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
    alignItems: "center",
    padding: "0 16px",
    fontWeight: "bold",
    fontSize: "14px",
    position: "fixed" as const,
    top: 0,
    left: 0,
    zIndex: 100,
    boxSizing: "border-box",
  },
  logo: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#fff",
    textDecoration: "none",
    marginRight: "20px",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    gap: "16px",
    flexWrap: "nowrap" as const,
    overflowX: "auto",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    whiteSpace: "nowrap" as const,
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "6px",
    padding: "2px 6px",
    minWidth: "140px",
  },
  searchInput: {
    border: "none",
    outline: "none",
    padding: "4px",
    fontSize: "14px",
    width: "100px",
  },
  searchIcon: {
    fontSize: "16px",
    color: "#4f71d6",
    cursor: "pointer",
    marginLeft: "4px",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
    gap: "10px",
    whiteSpace: "nowrap" as const,
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
} as const;

export default Header;
