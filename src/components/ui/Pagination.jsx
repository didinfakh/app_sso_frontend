import React from "react";

/**
 * Pagination Component
 *
 * Props:
 * - currentPage: Number
 * - totalPages: Number
 * - onPageChange: Function (callback with page number)
 * - pageSize: Number (current items per page)
 * - onPageSizeChange: Function (callback with new pageSize value)
 * - isLoading: Boolean
 */
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  isLoading = false,
}) {
  console.log("Pagination Props:", {
    currentPage,
    totalPages,
    pageSize,
    isLoading,
  });
  const renderPageButtons = () => {
    let pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          disabled={isLoading || i === currentPage}
          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 ${
            i === currentPage
              ? "bg-purple-600 text-white shadow-md shadow-purple-200"
              : "text-gray-600 hover:bg-purple-50 hover:text-purple-600 border border-transparent hover:border-purple-100"
          } disabled:cursor-not-allowed`}
        >
          {i}
        </button>,
      );
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
      {/* Page Size Selector */}
      <div className="flex items-center gap-2 text-sm text-gray-500 order-2 sm:order-1">
        <span>Tampilkan</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          disabled={isLoading}
          className="bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all cursor-pointer"
        >
          {[10, 25, 50, 100].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
        <span>entri</span>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-2 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isLoading || currentPage === 1}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <i className="fas fa-chevron-left text-xs"></i>
        </button>

        <div className="flex items-center gap-1.5 font-sans">
          {currentPage > 3 && totalPages > 5 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-600 border border-transparent transition-all"
              >
                1
              </button>
              <span className="text-gray-300 px-1 italic">...</span>
            </>
          )}

          {renderPageButtons()}

          {currentPage < totalPages - 2 && totalPages > 5 && (
            <>
              <span className="text-gray-300 px-1 italic">...</span>
              <button
                onClick={() => onPageChange(totalPages)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-600 border border-transparent transition-all"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLoading || currentPage === (totalPages || 1)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <i className="fas fa-chevron-right text-xs"></i>
        </button>
      </div>
    </div>
  );
}

export default Pagination;
