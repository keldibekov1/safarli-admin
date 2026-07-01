import { Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Country } from "@/api/countries";

const ALL = "__all__";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;

  countryId: string;
  onCountryChange: (value: string) => void;

  countries: Country[];
};

export default function CityFilters({
  search,
  onSearchChange,
  countryId,
  onCountryChange,
  countries,
}: Props) {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-5 py-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Shahar qidirish..."
          className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <Select
        value={countryId || ALL}
        onValueChange={(v) => onCountryChange(v === ALL ? "" : v)}
      >
        <SelectTrigger className="w-full sm:w-64">
          <SelectValue placeholder="Davlat bo'yicha filtr" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Barcha davlatlar</SelectItem>
          {countries.map((country) => (
            <SelectItem key={country.id} value={country.id}>
              {country.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
