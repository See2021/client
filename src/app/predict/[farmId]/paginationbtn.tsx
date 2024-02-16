import React from "react";

interface PaginationButtonsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationButtons: React.FC<PaginationButtonsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };
  return (
    <div className="flex justify-items-center">
      <button
        title="previous"
        type="button"
        className="inline-flex items-center justify-center w-8 h-8 py-0 
        border rounded-md shadow-md border-gray-800 border-r-0
        rounded-e-none"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <svg
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 text-black"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          type="button"
          className={`inline-flex items-center justify-center w-8 h-8 text-sm border rounded shadow-md border-gray-800 rounded-e-none rounded-s-none ${
            currentPage === index + 1
              ? "text-black bg-yellow-300"
              : "hover:bg-yellow-200"
          }`}
          onClick={() => handlePageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}

      <button
        title="next"
        type="button"
        className="inline-flex items-center justify-center w-8 h-8 py-0 
        border rounded-md shadow-md border-gray-800 rounded-s-none"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <svg
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 text-black"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default PaginationButtons;
