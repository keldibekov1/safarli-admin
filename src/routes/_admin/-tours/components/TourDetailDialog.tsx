import {
  Check,
  Eye,
  Heart,
  Phone,
  X,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatUZS } from "@/lib/mock-data";
import { formatDate, formatDateTime } from "@/lib/date";
import { mediaUrl } from "@/lib/media";
import { type Tour } from "@/api/tours";

import TourStatusBadge from "./TourStatusBadge";

type Props = {
  tour: Tour | null;
  setTour: (t: Tour | null) => void;
  onApprove: (tour: Tour) => void;
  onReject: (tour: Tour) => void;
};

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Eye;
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div>
        <p className="text-sm font-semibold leading-none">{value}</p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

export default function TourDetailDialog({
  tour,
  setTour,
  onApprove,
  onReject,
}: Props) {
  if (!tour) return null;

  const gallery = tour.gallery?.length ? tour.gallery : tour.image ? [tour.image] : [];

  return (
    <Dialog open={tour !== null} onOpenChange={(v) => !v && setTour(null)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>{tour.title}</span>
            <TourStatusBadge status={tour.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {gallery.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {gallery.map((src) => (
                <img
                  key={src}
                  src={mediaUrl(src)}
                  alt={tour.title}
                  className="h-40 w-60 shrink-0 rounded-xl object-cover"
                />
              ))}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <Stat icon={Eye} value={tour.viewsCount} label="Ko'rishlar" />
            <Stat icon={Heart} value={tour.likesCount} label="Yoqtirishlar" />
            <Stat icon={Phone} value={tour.callClicksCount} label="Qo'ng'iroqlar" />
          </div>

          <p className="text-sm text-muted-foreground">{tour.description}</p>

          <div className="divide-y divide-border rounded-xl border border-border px-4">
            <Row label="Narx" value={formatUZS(tour.price)} />
            <Row label="Davomiyligi" value={`${tour.days} kun / ${tour.nights} tun`} />
            <Row
              label="Sana"
              value={`${formatDate(tour.startDate)} — ${formatDate(tour.endDate)}`}
            />
            <Row
              label="Joylar"
              value={`${tour.bookedSlots} / ${tour.totalSlots ?? "∞"}`}
            />
            <Row label="Agentlik" value={tour.agency?.name ?? "—"} />
            <Row label="Davlat" value={tour.country?.name ?? "—"} />
            <Row label="Shahar" value={tour.city?.name ?? "—"} />
            <Row label="Yaratilgan" value={formatDateTime(tour.createdAt)} />
            {tour.features.length > 0 && (
              <Row
                label="Xususiyatlar"
                value={tour.features.map((f) => f.feature.name).join(", ")}
              />
            )}
            {tour.status === "REJECTED" && tour.rejectReason && (
              <Row
                label="Rad sababi"
                value={
                  <span className="text-destructive">{tour.rejectReason}</span>
                }
              />
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="destructive"
              disabled={tour.status === "REJECTED"}
              onClick={() => onReject(tour)}
            >
              <X className="mr-2 h-4 w-4" />
              Rad etish
            </Button>

            <Button
              disabled={tour.status === "APPROVED"}
              onClick={() => onApprove(tour)}
            >
              <Check className="mr-2 h-4 w-4" />
              Tasdiqlash
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
