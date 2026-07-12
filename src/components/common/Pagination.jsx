shravandavda — 11:15
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./common.css";

function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="ui-pagination">
      <button
        type="button"
        className="ui-paginationbutton"
        disabled={currentPage === 1}
        onClick={() => onPageChange?.(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={17} />
      </button>

      <span className="ui-paginationinfo">
        Page <strong>{currentPage}</strong> of{" "}
        <strong>{totalPages}</strong>
      </span>

      <button
        type="button"
        className="ui-pagination__button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange?.(currentPage + 1)}
        aria-label="Next page"
      >
        <ChevronRight size={17} />
      </button>
    </div>
  );
}

export default Pagination;
