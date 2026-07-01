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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Country } from "@/api/countries";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;

  name: string;
  setName: (v: string) => void;

  nameUz: string;
  setNameUz: (v: string) => void;

  nameRu: string;
  setNameRu: (v: string) => void;

  countryId: string;
  setCountryId: (v: string) => void;

  countries: Country[];

  onSubmit: () => void;
  loading: boolean;

  title?: string;
  submitLabel?: string;
};

export default function CityFormDialog({
  open,
  setOpen,
  name,
  setName,
  nameUz,
  setNameUz,
  nameRu,
  setNameRu,
  countryId,
  setCountryId,
  countries,
  onSubmit,
  loading,
  title = "Shahar qo'shish",
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
              placeholder="Tashkent"
            />
          </div>

          <div className="space-y-2">
            <Label>Nomi (UZ)</Label>
            <Input
              value={nameUz}
              onChange={(e) => setNameUz(e.target.value)}
              placeholder="Toshkent"
            />
          </div>

          <div className="space-y-2">
            <Label>Nomi (RU)</Label>
            <Input
              value={nameRu}
              onChange={(e) => setNameRu(e.target.value)}
              placeholder="Ташкент"
            />
          </div>

          <div className="space-y-2">
            <Label>Davlat</Label>
            <Select value={countryId} onValueChange={setCountryId}>
              <SelectTrigger>
                <SelectValue placeholder="Davlatni tanlang" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={country.id}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Bekor qilish
          </Button>

          <Button
            onClick={onSubmit}
            disabled={loading || !name.trim() || !countryId}
          >
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
