import { Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { type TourFeature } from "@/api/tour-features";

const MotionRow = motion(TableRow);

type Props = {
  features: TourFeature[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (f: TourFeature) => void;
  onDelete: (f: TourFeature) => void;
};

export default function TourFeaturesTable({
  features,
  isLoading,
  isError,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="w-16">#</TableHead>
            <TableHead>Nomi</TableHead>
            <TableHead className="text-right">Amal</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={3} className="h-32 text-center">
                Yuklanmoqda...
              </TableCell>
            </TableRow>
          )}

          {isError && (
            <TableRow>
              <TableCell colSpan={3} className="h-32 text-center text-red-500">
                Xatolik
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            !isError &&
            features.map((f, i) => (
              <MotionRow key={f.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <TableCell>{i + 1}</TableCell>
                <TableCell className="font-semibold">{f.name}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="ghost" onClick={() => onEdit(f)}>
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => onDelete(f)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </MotionRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}