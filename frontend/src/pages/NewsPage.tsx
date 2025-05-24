import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function NewsPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
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
      const res = await axios.get("http://localhost:8080/api/news/search", {
        params: { query: keyword, page: pageNum, size: pageSize },
        withCredentials: true
      });
      if (Array.isArray(res.data)) {
        setResults(res.data);
        setHasMore(res.data.length === pageSize);
      } else {
        setResults([]);
        setHasMore(false);
        console.warn("서버 응답이 배열이 아닙니다:", res.data);
      }
    } catch (error) {
      console.error("검색 실패:", error);
      setResults([]);
    }
  };

  const handleSubmit = () => {
    if (query.trim()) {
      navigate(`/news?query=${encodeURIComponent(query)}&page=1`);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      navigate(`/news?query=${encodeURIComponent(query)}&page=${page - 1}`);
    }
  };

  const handleNextPage = () => {
    navigate(`/news?query=${encodeURIComponent(query)}&page=${page + 1}`);
  };

  return (
    <>
      {/* ✅ 뉴스 콘텐츠 영역 */}
      <div style={{ padding: "80px 20px 100px" }}>
        <h2>실시간 뉴스 검색</h2>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          style={{ marginRight: "10px", padding: "8px", fontSize: "14px" }}
        />
        <button onClick={handleSubmit} style={{ padding: "8px 16px" }}>검색</button>

        <div style={{ marginTop: "20px" }}>
          {results.length > 0 ? (
            results.map((item, index) => (
              <div key={index} style={{ marginBottom: "12px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
                <h4 dangerouslySetInnerHTML={{ __html: item.title }} />
                <p dangerouslySetInnerHTML={{ __html: item.description }} />
                {item.summary && (
                  <p style={{ color: "#888", fontStyle: "italic" }}>요약: {item.summary}</p>
                )}
                <a href={item.link} target="_blank" rel="noopener noreferrer">기사 보기</a>
                <p style={{ color: "gray", fontSize: "12px" }}>{item.pDate}</p>
              </div>
            ))
          ) : (
            <p>표시할 뉴스가 없습니다.</p>
          )}
        </div>
      </div>

      {/* ✅ 뉴스 콘텐츠 div 바깥, return 내부에 존재 → 반드시 렌더링됨 */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#f9f9f9",
        padding: "12px 0",
        borderTop: "1px solid #ccc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        zIndex: 999
      }}>
        <button onClick={handlePrevPage} disabled={page === 1}>이전</button>
        <span style={{ fontWeight: "bold" }}>{page} 페이지</span>
        <button onClick={handleNextPage} disabled={!hasMore}>다음</button>
      </div>
    </>
  );
}

export default NewsPage;
