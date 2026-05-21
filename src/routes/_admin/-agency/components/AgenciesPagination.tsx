type AgenciesPaginationProps = {
  currentPage: number;
  isFetching: boolean;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function AgenciesPagination({
  currentPage,
  isFetching,
  total,
  totalPages,
  onPageChange,
}: AgenciesPaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-border px-5 py-3">
      <p className="text-xs text-muted-foreground">
        Sahifa {currentPage} / {totalPages} · Jami: {total}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage <= 1 || isFetching}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium disabled:opacity-50 hover:bg-muted"
        >
          Oldingi
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isFetching}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium disabled:opacity-50 hover:bg-muted"
        >
          Keyingi
        </button>
      </div>
    </div>
  );
}
