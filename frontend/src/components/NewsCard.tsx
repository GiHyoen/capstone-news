import React from "react";

interface NewsCardProps {
  title: string;
  summary: string;
  link: string;
  date: string;
  image?: string; // 선택: 썸네일 이미지 (없으면 생략)
}

const NewsCard: React.FC<NewsCardProps> = ({ title, summary, link, date, image }) => {
  return (
    <div style={styles.card}>
      {image && (
        <img src={image} alt="뉴스 썸네일" style={styles.thumbnail} />
      )}
      <div style={styles.content}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.summary}>{summary}</p>
        <a href={link} target="_blank" rel="noopener noreferrer" style={styles.link}>
          원문 보기
        </a>
        <p style={styles.date}>{date}</p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    display: "flex",
    flexDirection: "row",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  thumbnail: {
    width: "120px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "6px",
    marginRight: "16px",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: "18px",
    margin: "0 0 8px 0",
    fontWeight: "bold",
  },
  summary: {
    fontSize: "14px",
    margin: "0 0 12px 0",
    color: "#555",
  },
  link: {
    fontSize: "14px",
    color: "#0077cc",
    textDecoration: "underline",
    marginRight: "12px",
  },
  date: {
    fontSize: "12px",
    color: "#999",
    marginTop: "4px",
  },
};

export default NewsCard;