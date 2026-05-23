import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getPages(current: number, total: number) {
  const delta = 2;
  const range: (number | "...")[] = [];

  const left = Math.max(1, current - delta);
  const right = Math.min(total, current + delta);

  let last: number | null = null;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= left && i <= right)) {
      if (last && i - last > 1) {
        range.push("...");
      }
      range.push(i);
      last = i;
    }
  }

  return range;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: Props) {
  const pages = getPages(page, totalPages);

  return (
    <div className="flex items-center justify-between border-t border-border px-5 py-3">
      <p className="text-xs text-muted-foreground">
        Sahifa {page} / {totalPages}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p, idx) =>
          p === "..." ? (
            <span
              key={`dots-${idx}`}
              className="px-2 text-sm text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`h-9 min-w-9 rounded-lg border text-sm ${
                p === page
                  ? "bg-primary text-white border-primary"
                  : "border-border hover:bg-muted/40"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}