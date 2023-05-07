import React, { useState, useEffect } from 'react';
import './Pagination.css'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [displayedPages, setDisplayedPages] = useState([]);

  useEffect(() => {
    const range = [];
    const halfRange = 2;
    let lowerLimit = Math.max(1, currentPage - halfRange);
    let upperLimit = Math.min(totalPages, currentPage + halfRange);

    if (currentPage <= halfRange + 1) {
      upperLimit = 1 + halfRange * 2;
    } else if (currentPage >= totalPages - halfRange) {
      lowerLimit = totalPages - halfRange * 2;
    }

    for (let i = lowerLimit; i <= upperLimit; i++) {
      range.push(i);
    }

    setDisplayedPages(range);
  }, [currentPage, totalPages]);

  const handlePageClick = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const renderPages = () => {
    const pages = [];
  
    // Render the first page
    if (displayedPages[0] > 1) {
      pages.push(
        <button
          key={1}
          className={`pagination__item`}
          onClick={() => handlePageClick(1)}
        >
          {1}
        </button>
      );
    }
  
    // Render ellipsis if necessary
    if (displayedPages[0] > 2) {
      pages.push(
        <span key="ellipsis1" className="pagination__ellipsis">
          ...
        </span>
      );
    }
  
    // Render the displayed pages
    displayedPages.forEach((page) => {
      pages.push(
        <button
          key={page}
          className={`pagination__item ${page === currentPage ? 'pagination__item--active' : ''}`}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </button>
      );
    });
  
    // Render ellipsis if necessary
    if (displayedPages[displayedPages.length - 1] < totalPages - 1) {
      pages.push(
        <span key="ellipsis2" className="pagination__ellipsis">
          ...
        </span>
      );
    }
  
    // Render the last page
    if (displayedPages[displayedPages.length - 1] < totalPages) {
      pages.push(
        <button
          key={totalPages}
          className={`pagination__item`}
          onClick={() => handlePageClick(totalPages)}
        >
          {totalPages}
        </button>
      );
    }
  
    return pages;
  };

  return (
    <nav aria-label="Pagination">
      <div className="pagination">
        <button
          className={`pagination__item ${currentPage === 1 ? 'pagination__item--disabled' : ''}`}
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {'<'}
        </button>
        {renderPages()}
        <button
          className={`pagination__item ${currentPage === totalPages ? 'pagination__item--disabled' : ''}`}
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {'>'}
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
