import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onPerPageChange,
  perPage,
}) {
  // Generate array of page numbers to display
  const getVisiblePages = () => {
    const delta = 1; // Number of pages to show before and after current page
    const pages = [];

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push("...");
    }

    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = totalPages > 0 ? getVisiblePages() : [];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-2 py-2">
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-700">
          <span className="font-medium">{currentPage}</span> of{" "}
          <span className="font-medium">{totalPages}</span> pages
        </div>
        <select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className="bg-white text-sm border border-gray-300 text-gray-700 py-1.5 px-3 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Rows per page"
        >
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>

      <nav className="flex items-center justify-center sm:justify-end">
        <ul className="flex items-center -space-x-px">
          <li>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center h-8 w-8 ml-0 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
          </li>

          {visiblePages.map((page, index) => (
            <li key={index}>
              {page === "..." ? (
                <span className="flex items-center justify-center h-8 px-3 border border-gray-300 bg-white text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`flex items-center justify-center h-8 px-3 border border-gray-300 ${
                    currentPage === page
                      ? "bg-blue-50 text-blue-600 border-blue-300 z-10 font-medium"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              )}
            </li>
          ))}

          <li>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex items-center justify-center h-8 w-8 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
