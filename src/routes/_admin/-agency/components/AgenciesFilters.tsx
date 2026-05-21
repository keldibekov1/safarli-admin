import { Filter, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type AgencyStatusFilter } from "../route-search";

type AgenciesFiltersProps = {
  search: string;
  statusFilter: AgencyStatusFilter;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: AgencyStatusFilter) => void;
};

export function AgenciesFilters({
  search,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: AgenciesFiltersProps) {
  return (
    <Tabs
      value={statusFilter}
      onValueChange={(value) => onStatusChange(value as AgencyStatusFilter)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsList className="rounded-xl bg-muted p-1">
          <TabsTrigger value="all" className="rounded-lg">
            Hammasi
          </TabsTrigger>
          <TabsTrigger value="active" className="rounded-lg">
            Faol
          </TabsTrigger>
          <TabsTrigger value="inactive" className="rounded-lg">
            Faol emas
          </TabsTrigger>
        </TabsList>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Qidirish..."
              className="h-10 w-64 rounded-xl border border-border bg-card pl-9 pr-4 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium hover:bg-muted">
            <Filter className="h-4 w-4" /> Filtr
          </button>
        </div>
      </div>
    </Tabs>
  );
}
