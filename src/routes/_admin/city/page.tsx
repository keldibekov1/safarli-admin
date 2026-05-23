import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

import { type City } from "@/api/city";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import Pagination from "@/components/admin/Pagination";

import {
  useCitiesQuery,
  useDeleteCityMutation,
} from "@/services/city";

import CityTable from "./components/CityTable";
import CityHeader from "./components/CityHeader";

export const Route = createFileRoute("/_admin/city/page")({
  component: CitiesPage,
});

const LIMIT = 10;

export default function CitiesPage() {
  const [page, setPage] = useState(1);
  const [cityToDelete, setCityToDelete] = useState<City | null>(null);

  const citiesQuery = useCitiesQuery({
    page,
    limit: LIMIT,
  });

  const cities = citiesQuery.data?.data ?? [];
  const totalPages = citiesQuery.data?.totalPages ?? 1;

  const deleteCityMutation = useDeleteCityMutation({
    onSuccess: () => {
      toast.success("Shahar o'chirildi");
      setCityToDelete(null);
    },
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
      >
        <CityHeader total={citiesQuery.data?.total} />

        <CityTable
          cities={cities}
          isLoading={citiesQuery.isLoading}
          isError={citiesQuery.isError}
          onDelete={setCityToDelete}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </motion.div>

      <ConfirmDialog
        open={!!cityToDelete}
        onOpenChange={(open) => !open && setCityToDelete(null)}
        title="Shaharni o'chirish"
        description={
          cityToDelete
            ? `${cityToDelete.name} shahrini o'chirishni tasdiqlaysizmi?`
            : ""
        }
        confirmText="O'chirish"
        isLoading={deleteCityMutation.isPending}
        onConfirm={() =>
          cityToDelete &&
          deleteCityMutation.mutate(cityToDelete.id)
        }
      />
    </div>
  );
}