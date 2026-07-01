import { useMemo } from "react";
import { ArrowUpDown, Eye, MapPin, MoreVertical, Pause, Pencil, Play, Star, Trash2 } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { type Agency } from "@/api/agencies";
import { assetUrl } from "@/api/api";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusStyles = {
  active: "bg-success/15 text-success border-success/30",
  inactive: "bg-destructive/15 text-destructive border-destructive/30",
};

type UseAgencyColumnsOptions = {
  onEdit: (agency: Agency) => void;
  onToggleStatus: (agency: Agency) => void;
  onDelete: (agency: Agency) => void;
};

export function useAgencyColumns({
  onEdit,
  onToggleStatus,
  onDelete,
}: UseAgencyColumnsOptions) {
  return useMemo<ColumnDef<Agency>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting()}
            className="flex items-center gap-1 font-semibold"
          >
            Agency <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.logo ? (
              <img
                src={assetUrl(row.original.logo)}
                alt={`${row.original.name} logo`}
                className="h-10 w-10 rounded-xl border border-border object-cover shadow-soft"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-xs font-bold text-white shadow-soft">
                {row.original.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <Link
                  to="/agencies/$id"
                  params={{ id: row.original.id }}
                  className="font-semibold hover:text-primary hover:underline"
                >
                  {row.original.name}
                </Link>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {row.original.region?.name ?? row.original.address}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: "Telefon raqam",
        cell: ({ row }) => <span className="text-sm font-medium">{row.original.phone}</span>,
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={cn(
              "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize",
              row.original.isActive ? statusStyles.active : statusStyles.inactive,
            )}
          >
            {row.original.isActive ? "Faol" : "Faol emas"}
          </span>
        ),
      },
      {
        accessorKey: "rating",
        header: "Reyting",
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1 text-sm font-semibold">
            <Star className="h-3.5 w-3.5  text-warning" />
            {row.original.rating}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-lg p-1.5 hover:bg-muted">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem asChild>
                  <Link to="/agencies/$id" params={{ id: row.original.id }}>
                    <Eye className="mr-2 h-4 w-4" /> Ko'rish
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(row.original)}>
                  <Pencil className="mr-2 h-4 w-4" /> Tahrirlash
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleStatus(row.original)}>
                  {row.original.isActive ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" /> To'xtatish
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" /> Faollashtirish
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete(row.original)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> O'chirish
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [onEdit, onToggleStatus, onDelete],
  );
}
