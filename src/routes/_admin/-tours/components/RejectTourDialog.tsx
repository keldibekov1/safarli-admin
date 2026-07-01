import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type Tour } from "@/api/tours";

type Props = {
  tour: Tour | null;
  setTour: (t: Tour | null) => void;
  reason: string;
  setReason: (v: string) => void;
  onConfirm: () => void;
  loading: boolean;
};

export default function RejectTourDialog({
  tour,
  setTour,
  reason,
  setReason,
  onConfirm,
  loading,
}: Props) {
  return (
    <Dialog open={tour !== null} onOpenChange={(v) => !v && setTour(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Turni rad etish</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{tour?.title}</span>{" "}
            turini rad etish sababini kiriting.
          </p>

          <div className="space-y-2">
            <Label>Rad etish sababi</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Masalan: rasmlar sifati past, ma'lumotlar to'liq emas..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setTour(null)}>
            Bekor qilish
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading || !reason.trim()}
          >
            Rad etish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
