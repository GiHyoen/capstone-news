import React from "react";

const mockRecommendations = [
  "알쓸신잡! 한 입 꿀팁만 모아봤어요",
  "정치권의 키워드, 지금 이슈는?",
  "이 뉴스도 관심 있을까요?",
  "‘핫한 이슈’ 태그로 본 요약 뉴스 모음",
  "이 기사를 읽은 사람은 이런 기사도 봤어요",
];

function SidebarRecommendations() {
  return (
    <div style={styles.wrapper}>
      <h3 style={styles.heading}>이런 기사 어때요?</h3>
      <ul style={styles.list}>
        {mockRecommendations.map((text, idx) => (
          <li key={idx} style={styles.item}>
            <span style={styles.bullet}>+</span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
      <button style={styles.button}>새로보기</button>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    backgroundColor: "#f6f8fa",
    borderRadius: "8px",
    padding: "16px",
  },
  heading: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "12px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  item: {
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    color: "#333",
  },
  bullet: {
    marginRight: "8px",
    color: "#2b6cb0",
    fontWeight: "bold",
  },
  button: {
    marginTop: "16px",
    padding: "6px 12px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontSize: "13px",
  },
};

export default SidebarRecommendations;