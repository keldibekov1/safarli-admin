import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;

  name: string;
  setName: (v: string) => void;

  nameUz: string;
  setNameUz: (v: string) => void;

  nameRu: string;
  setNameRu: (v: string) => void;

  onCreate: () => void;
  loading: boolean;

  title?: string;
  submitLabel?: string;
};

export default function CreateCountryDialog({
  open,
  setOpen,
  name,
  setName,
  nameUz,
  setNameUz,
  nameRu,
  setNameRu,
  onCreate,
  loading,
  title = "Davlat qo'shish",
  submitLabel = "Saqlash",
}: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nomi</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Uzbekistan"
            />
          </div>

          <div className="space-y-2">
            <Label>Nomi (UZ)</Label>
            <Input
              value={nameUz}
              onChange={(e) => setNameUz(e.target.value)}
              placeholder="O'zbekiston"
            />
          </div>

          <div className="space-y-2">
            <Label>Nomi (RU)</Label>
            <Input
              value={nameRu}
              onChange={(e) => setNameRu(e.target.value)}
              placeholder="Узбекистан"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Bekor qilish
          </Button>

          <Button onClick={onCreate} disabled={loading || !name.trim()}>
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
