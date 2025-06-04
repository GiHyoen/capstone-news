import React from "react";
import { useNavigate } from "react-router-dom";
import "./Pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  query: string;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, query }) => {
  const navigate = useNavigate();

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      navigate(`/news?query=${encodeURIComponent(query)}&page=${page}`);
    }
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination-container">
      <button
        className="arrow-button"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ←
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`page-button ${currentPage === page ? "active" : ""}`}
        >
          {page}
        </button>
      ))}
      <button
        className="arrow-button"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        →
      </button>
    </div>
  );
};

export default Pagination;