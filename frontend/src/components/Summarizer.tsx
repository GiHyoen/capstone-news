import { useState } from "react";
import axios from "axios";

function Summarizer() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");

  const handleSummarize = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/summarize", {
        text: text,
      });

      setSummary(response.data.summary);
    } catch (error: any) {
      console.error("요약 실패:", error);
      setSummary("(요약 실패)");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>뉴스 요약</h2>
      <textarea
        rows={10}
        cols={60}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="요약할 텍스트를 입력하세요"
      />
      <br />
      <button onClick={handleSummarize} style={{ marginTop: "10px" }}>
        요약하기
      </button>
      {summary && (
        <div style={{ marginTop: "20px" }}>
          <h3>요약 결과:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default Summarizer;