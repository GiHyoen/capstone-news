import { useState } from "react";
import axios from "axios";

function NewsPage() {
  const [query, setQuery] = useState("");
  const [newsList, setNewsList] = useState<any[]>([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/news/search?query=${query}`);
      const items = response.data.items || [];
      setNewsList(items);
    } catch (err) {
      console.error("뉴스 검색 실패", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📰 실시간 뉴스 검색</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="검색어를 입력하세요"
        style={{ padding: "10px", width: "300px", marginRight: "10px" }}
      />
      <button onClick={handleSearch}>검색</button>

      <ul>
        {newsList.map((item, index) => (
          <li key={index} style={{ marginTop: "20px" }}>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              <strong dangerouslySetInnerHTML={{ __html: item.title }} />
            </a>
            <p dangerouslySetInnerHTML={{ __html: item.description }} />
            <small>{item.pubDate}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NewsPage;