import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function NewsPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("query") || "";
    setQuery(q);
    if (q) handleSearch(q);
  }, [location.search]);

  const handleSearch = async (keyword: string) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/news/search?query=${encodeURIComponent(keyword)}`, {
        withCredentials: true
      });
      if (Array.isArray(res.data)) {
        setResults(res.data);
      } else {
        console.warn("서버 응답이 배열이 아닙니다:", res.data);
        setResults([]);
      }
    } catch (error) {
      console.error("❌ 검색 실패:", error);
      setResults([]);
    }
  };

  const handleSubmit = () => {
    if (query.trim()) navigate(`/news?query=${encodeURIComponent(query)}`);
  };

  return (
    <div style={{ padding: "80px 20px 20px" }}>
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
  );
}

export default NewsPage;