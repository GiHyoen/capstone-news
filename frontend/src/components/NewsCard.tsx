import React from "react";
import './NewsCard.css';

interface NewsCardProps {
  title: string;
  summary: string;
  link: string;
  date: string;
  image?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  summary,
  link,
  date,
  image,
}) => {
  return (
    <div className="news-card">
      {image && (
        <div className="news-thumbnail-wrapper">
          <img src={image} alt="썸네일" className="news-thumbnail" />
        </div>
      )}
      <div className="news-content">
        <h4 className="news-title" dangerouslySetInnerHTML={{ __html: title }} />
        <p className="news-summary">{summary}</p>
        <div className="news-footer">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="news-link"
          >
            원문 보기
          </a>
          <span className="news-date">{date}</span>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;