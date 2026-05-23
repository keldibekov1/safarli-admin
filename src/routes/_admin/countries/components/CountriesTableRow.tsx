import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

import { type Country } from "@/api/countries";

type Props = {
  country: Country;
  index: number;
  onDelete: (country: Country) => void;
};

export default function CountriesTableRow({
  country,
  index,
  onDelete,
}: Props) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className="transition hover:bg-muted/30"
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-sm font-bold text-white shadow-soft">
            {country.name.slice(0, 1).toUpperCase()}
          </div>

          <span className="font-semibold">
            {country.name}
          </span>
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="flex justify-end">
          <button
            onClick={() => onDelete(country)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10"
            aria-label={`${country.name}ni o'chirish`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}