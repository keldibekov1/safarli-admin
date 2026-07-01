import { Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type TourStatus } from "@/api/tours";
import { type Country } from "@/api/countries";
import { type City } from "@/api/city";
import { type Agency } from "@/api/agencies";

const ALL = "__all__";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;

  status: TourStatus | "";
  onStatusChange: (v: TourStatus | "") => void;

  countryId: string;
  onCountryChange: (v: string) => void;

  cityId: string;
  onCityChange: (v: string) => void;

  agencyId: string;
  onAgencyChange: (v: string) => void;

  countries: Country[];
  cities: City[];
  agencies: Agency[];
};

const STATUS_OPTIONS: { value: TourStatus; label: string }[] = [
  { value: "PENDING", label: "Kutilmoqda" },
  { value: "APPROVED", label: "Tasdiqlangan" },
  { value: "REJECTED", label: "Rad etilgan" },
];

export default function TourFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  countryId,
  onCountryChange,
  cityId,
  onCityChange,
  agencyId,
  onAgencyChange,
  countries,
  cities,
  agencies,
}: Props) {
  return (
    <div className="grid gap-3 border-b border-border px-5 py-4 lg:grid-cols-12">
      <div className="relative lg:col-span-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tur qidirish..."
          className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="lg:col-span-2">
        <Select
          value={status || ALL}
          onValueChange={(v) =>
            onStatusChange(v === ALL ? "" : (v as TourStatus))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Barcha statuslar</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="lg:col-span-2">
        <Select
          value={countryId || ALL}
          onValueChange={(v) => onCountryChange(v === ALL ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Davlat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Barcha davlatlar</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="lg:col-span-2">
        <Select
          value={cityId || ALL}
          onValueChange={(v) => onCityChange(v === ALL ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Shahar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Barcha shaharlar</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="lg:col-span-2">
        <Select
          value={agencyId || ALL}
          onValueChange={(v) => onAgencyChange(v === ALL ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Agentlik" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Barcha agentliklar</SelectItem>
            {agencies.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
