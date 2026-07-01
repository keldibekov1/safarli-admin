import { cn } from "@/lib/utils";
import { type TourStatus } from "@/api/tours";

const MAP: Record<TourStatus, { label: string; className: string }> = {
  PENDING: {
    label: "Kutilmoqda",
    className: "bg-warning/15 text-warning",
  },
  APPROVED: {
    label: "Tasdiqlangan",
    className: "bg-success/15 text-success",
  },
  REJECTED: {
    label: "Rad etilgan",
    className: "bg-destructive/15 text-destructive",
  },
};

export default function TourStatusBadge({ status }: { status: TourStatus }) {
  const { label, className } = MAP[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        className,
      )}
    >
      {label}
    </span>
  );
}
