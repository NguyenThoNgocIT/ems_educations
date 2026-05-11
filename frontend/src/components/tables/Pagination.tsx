type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pagesAroundCurrent = Array.from(
    { length: Math.min(3, totalPages) },
    (_, i) => i + Math.max(currentPage - 1, 1),
  );

  return (
    <div className="flex items-center">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="shadow-theme-xs mr-2.5 flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-4 leading-relaxed00 dark:hover:bg-white/[0.03]"
      >
        Previous
      </button>
      <div className="flex items-center gap-2">
        {currentPage > 3 && <span className="px-2">...</span>}
        {pagesAroundCurrent.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`rounded px-4 py-2 ${
              currentPage === page
                ? "bg-indigo-600 text-white"
                : "text-slate-900 dark:text-slate-400"
            } flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium hover:bg-blue-500/[0.08] hover:text-indigo-600 dark:hover:text-indigo-600`}
          >
            {page}
          </button>
        ))}
        {currentPage < totalPages - 2 && <span className="px-2">...</span>}
      </div>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="shadow-theme-xs ml-2.5 flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-4 leading-relaxed00 dark:hover:bg-white/[0.03]"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

