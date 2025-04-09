import { useState } from "react";
import axios from "axios";

function NewsPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    console.log("검색 버튼 클릭됨");
    try {
      const response = await axios.get(`http://localhost:8080/api/news/search?query=${encodeURIComponent(query)}`);
      setResults(response.data); // ✅ 바로 사용
    } catch (err) {
      console.error("검색 실패", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>실시간 뉴스 검색</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어를 입력하세요"
        style={{ marginRight: "10px", padding: "8px", fontSize: "14px" }}
      />
      <button onClick={handleSearch} style={{ padding: "8px 16px" }}>검색</button>

      <div style={{ marginTop: "20px" }}>
        {results.length > 0 &&
          results.map((item: any, index) => (
            <div key={index} style={{ marginBottom: "12px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
              <h4 dangerouslySetInnerHTML={{ __html: item.title }} />
              <p dangerouslySetInnerHTML={{ __html: item.description }} />
              <a href={item.link} target="_blank" rel="noopener noreferrer">기사 보기</a>
              <p style={{ color: "gray", fontSize: "12px" }}>{item.pDate}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default NewsPage;