import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { flexRender, type Table } from "@tanstack/react-table";
import { type Agency } from "@/api/agencies";

type AgenciesTableProps = {
  columnsCount: number;
  footer?: ReactNode;
  isError: boolean;
  isLoading: boolean;
  table: Table<Agency>;
};

export function AgenciesTable({
  columnsCount,
  footer,
  isError,
  isLoading,
  table,
}: AgenciesTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr>
                <td
                  colSpan={columnsCount}
                  className="py-16 text-center text-sm text-muted-foreground"
                >
                  Yuklanmoqda...
                </td>
              </tr>
            )}

            {isError && (
              <tr>
                <td colSpan={columnsCount} className="py-16 text-center text-sm text-destructive">
                  Agencylarni yuklashda xatolik yuz berdi.
                </td>
              </tr>
            )}

            {!isLoading &&
              !isError &&
              table.getRowModel().rows.map((row, index) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="transition hover:bg-muted/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))}

            {!isLoading && !isError && table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={columnsCount}
                  className="py-16 text-center text-sm text-muted-foreground"
                >
                  Hech qanday agency topilmadi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {footer}
    </motion.div>
  );
}
