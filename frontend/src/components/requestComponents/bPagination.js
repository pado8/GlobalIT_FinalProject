import React from 'react';

const Pagination = ({ current, size, totalCount, onPageChange, prev, next }) => {
  const totalPages = Math.ceil(totalCount / size);

  return (
    <div className="flex justify-center items-center gap-4 mt-4">
      <button
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        onClick={() => onPageChange(current - 1)}
        disabled={!prev}
      >
        Prev
      </button>

      <div className="font-semibold">
        {current} / {totalPages}
      </div>

      <button
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        onClick={() => onPageChange(current + 1)}
        disabled={!next}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
