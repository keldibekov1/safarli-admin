import { motion } from "framer-motion";
import { Check, Eye, ImageIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatUZS } from "@/lib/mock-data";
import { mediaUrl } from "@/lib/media";
import { type Tour } from "@/api/tours";

import TourStatusBadge from "./TourStatusBadge";

type Props = {
  tours: Tour[];
  isLoading: boolean;
  isError: boolean;
  onView: (tour: Tour) => void;
  onApprove: (tour: Tour) => void;
  onReject: (tour: Tour) => void;
};

const COLS = 6;

export default function ToursTable({
  tours,
  isLoading,
  isError,
  onView,
  onApprove,
  onReject,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted/40">
          <tr>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tur
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Agentlik
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Yo'nalish
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Narx
            </th>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </th>
            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Amal
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {isLoading && (
            <tr>
              <td colSpan={COLS} className="px-5 py-12 text-center text-sm text-muted-foreground">
                Yuklanmoqda...
              </td>
            </tr>
          )}

          {isError && (
            <tr>
              <td colSpan={COLS} className="px-5 py-12 text-center text-sm text-destructive">
                Turlarni yuklashda xatolik yuz berdi.
              </td>
            </tr>
          )}

          {!isLoading &&
            !isError &&
            tours.map((tour, index) => (
              <motion.tr
                key={tour.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="transition hover:bg-muted/30"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
                      {tour.image ? (
                        <img
                          src={mediaUrl(tour.image)}
                          alt={tour.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{tour.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {tour.days} kun / {tour.nights} tun
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-muted-foreground">
                  {tour.agency?.name ?? "—"}
                </td>

                <td className="px-5 py-4 text-sm text-muted-foreground">
                  {[tour.city?.name, tour.country?.name]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </td>

                <td className="px-5 py-4 text-sm font-medium">
                  {formatUZS(tour.price)}
                </td>

                <td className="px-5 py-4">
                  <TourStatusBadge status={tour.status} />
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onView(tour)}
                      aria-label="Ko'rish"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-success disabled:opacity-40"
                      disabled={tour.status === "APPROVED"}
                      onClick={() => onApprove(tour)}
                      aria-label="Tasdiqlash"
                    >
                      <Check className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive disabled:opacity-40"
                      disabled={tour.status === "REJECTED"}
                      onClick={() => onReject(tour)}
                      aria-label="Rad etish"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}

          {!isLoading && !isError && tours.length === 0 && (
            <tr>
              <td colSpan={COLS} className="px-5 py-12 text-center text-sm text-muted-foreground">
                Turlar topilmadi.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
