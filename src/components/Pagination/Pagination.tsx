import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const maxVisiblePages = 5;
  const halfVisible = Math.floor(maxVisiblePages / 2);

  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className={styles.pagination}>
      <button
        className={styles.paginationButton}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <i className="fa-solid fa-chevron-left" />
      </button>

      {startPage > 1 && (
        <>
          <button
            className={styles.paginationButton}
            onClick={() => onPageChange(1)}
          >
            1
          </button>
          {startPage > 2 && (
            <span className={styles.paginationEllipsis}>...</span>
          )}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          className={`${styles.paginationButton} ${
            currentPage === page ? styles.paginationButtonActive : ""
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className={styles.paginationEllipsis}>...</span>
          )}
          <button
            className={styles.paginationButton}
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className={styles.paginationButton}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <i className="fa-solid fa-chevron-right" />
      </button>
    </div>
  );
};

export default Pagination;
