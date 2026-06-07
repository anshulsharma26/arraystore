import './Pagination.css';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const getPageNumbers = () => {
    const pages_arr = [];
    const delta = 2;
    const left = Math.max(2, page - delta);
    const right = Math.min(pages - 1, page + delta);

    pages_arr.push(1);
    if (left > 2) pages_arr.push('...');
    for (let i = left; i <= right; i++) pages_arr.push(i);
    if (right < pages - 1) pages_arr.push('...');
    if (pages > 1) pages_arr.push(pages);

    return pages_arr;
  };

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        <HiChevronLeft />
      </button>

      {getPageNumbers().map((num, idx) => (
        <button
          key={idx}
          className={`pagination-btn ${num === page ? 'active' : ''} ${num === '...' ? 'dots' : ''}`}
          onClick={() => num !== '...' && onPageChange(num)}
          disabled={num === '...'}
        >
          {num}
        </button>
      ))}

      <button
        className="pagination-btn"
        disabled={page === pages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        <HiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
