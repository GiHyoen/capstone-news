import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import NewsCard from "../components/NewsCard";
import SidebarRecommendations from "../components/SidebarRecommendations";
import Pagination from "../components/Pagination";

function NewsPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const pageSize = 5;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("query") || "";
    const p = parseInt(params.get("page") || "1", 10);
    setQuery(q);
    setPage(p);
    if (q) handleSearch(q, p);
  }, [location.search]);

  const handleSearch = async (keyword: string, pageNum: number) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/summarize/summarize",
        {},
        {
          params: { query: keyword, page: pageNum, size: pageSize },
          withCredentials: true,
        }
      );
      if (res.data.results) {
        setResults(res.data.results);
        setTotalPages(res.data.totalPages || 10); // 총 페이지 수 백엔드에서 받아온다면 반영
      } else {
        setResults([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("요약 실패:", error);
      setResults([]);
    }
  };

  const handleSubmit = () => {
    if (query.trim()) {
      navigate(`/news?query=${encodeURIComponent(query)}&page=1`);
    }
  };

  const handlePageChange = (newPage: number) => {
    navigate(`/news?query=${encodeURIComponent(query)}&page=${newPage}`);
  };

  return (
    <>
      <div style={styles.container}>
        {/* 좌측 뉴스 리스트 */}
        <div style={styles.mainColumn}>
          <h2 style={styles.heading}>‘{query}’ 에 대한 검색결과</h2>
          <div style={styles.searchRow}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={styles.searchInput}
            />
            <button onClick={handleSubmit} style={styles.searchButton}>
              검색
            </button>
          </div>

          <div style={styles.cardList}>
            {results.map((item, index) => (
              <NewsCard
                key={index}
                title={item.title}
                summary={item.summary}
                link={item.link}
                date={item.date}
                image={item.image}
              />
            ))}
          </div>

          {/* 하단 페이지네이션 */}
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} query={query}/>
        </div>

        {/* 우측 사이드 추천 */}
        <div style={styles.sidebar}>
          <SidebarRecommendations />
        </div>
      </div>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    padding: "100px 24px 80px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  mainColumn: {
    flex: 3,
    paddingRight: "24px",
  },
  sidebar: {
    flex: 1,
    borderLeft: "1px solid #eee",
    paddingLeft: "16px",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "12px",
  },
  searchRow: {
    display: "flex",
    marginBottom: "20px",
  },
  searchInput: {
    flex: 1,
    padding: "8px",
    fontSize: "14px",
    marginRight: "10px",
  },
  searchButton: {
    padding: "8px 16px",
  },
  cardList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
};

export default NewsPage;