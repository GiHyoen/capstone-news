import { FaSearch } from "react-icons/fa";

function Header() {
  return (
    <header style={styles.header}>
      {/* '오늘의 뉴스' 클릭 시 /로 이동하도록 수정 */}
      <a href="/" style={styles.logo}>오늘의 뉴스</a>
      <nav style={styles.nav}>
        <a href="/" style={styles.link}>홈</a>
        <a href="/world" style={styles.link}>세계</a>
        <a href="/politics" style={styles.link}>정치</a>
        <a href="/economy" style={styles.link}>경제</a>
        <a href="/login" style={styles.link}>로그인</a>
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
    textDecoration: "none" // 링크 스타일 유지
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "28px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
  },
  searchIcon: {
    fontSize: "20px",
    color: "#fff",
    cursor: "pointer",
  },
} as const;

export default Header;