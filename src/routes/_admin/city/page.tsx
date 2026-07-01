import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { type City } from "@/api/city";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import Pagination from "@/components/admin/Pagination";
import { useDebounce } from "@/hooks/use-debounce";

import {
  useCitiesQuery,
  useCreateCityMutation,
  useDeleteCityMutation,
  useUpdateCityMutation,
} from "@/services/city";
import { useAllCountriesQuery } from "@/services/countries";

import CityTable from "./components/CityTable";
import CityHeader from "./components/CityHeader";
import CityFilters from "./components/CityFilters";
import CityFormDialog from "./components/CityFormDialog";

export const Route = createFileRoute("/_admin/city/page")({
  component: CitiesPage,
});

const LIMIT = 10;

export default function CitiesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

  const [cityToDelete, setCityToDelete] = useState<City | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editCity, setEditCity] = useState<City | null>(null);

  const [name, setName] = useState("");
  const [nameUz, setNameUz] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [countryId, setCountryId] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  // reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, countryFilter]);

  const countriesQuery = useAllCountriesQuery();
  const countries = countriesQuery.data ?? [];

  const citiesQuery = useCitiesQuery({
    page,
    limit: LIMIT,
    search: debouncedSearch,
    countryId: countryFilter,
  });

  const cities = citiesQuery.data?.data ?? [];
  const totalPages = citiesQuery.data?.totalPages ?? 1;

  const resetForm = () => {
    setName("");
    setNameUz("");
    setNameRu("");
    setCountryId("");
  };

  const createMutation = useCreateCityMutation({
    onSuccess: () => {
      toast.success("Shahar qo'shildi");
      setCreateOpen(false);
      resetForm();
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const updateMutation = useUpdateCityMutation({
    onSuccess: () => {
      toast.success("Shahar yangilandi");
      setEditCity(null);
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const deleteCityMutation = useDeleteCityMutation({
    onSuccess: () => {
      toast.success("Shahar o'chirildi");
      setCityToDelete(null);
    },
  });

  const openCreate = () => {
    resetForm();
    setCreateOpen(true);
  };

  const openEdit = (city: City) => {
    setEditCity(city);
    setName(city.name);
    setNameUz(city.nameUz ?? "");
    setNameRu(city.nameRu ?? "");
    setCountryId(city.countryId);
  };

  const handleCreate = () => {
    createMutation.mutate({
      name: name.trim(),
      nameUz: nameUz.trim() || null,
      nameRu: nameRu.trim() || null,
      countryId,
    });
  };

  const handleUpdate = () => {
    if (!editCity) return;

    updateMutation.mutate({
      id: editCity.id,
      data: {
        name: name.trim(),
        nameUz: nameUz.trim() || null,
        nameRu: nameRu.trim() || null,
        countryId,
      },
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
      >
        <CityHeader total={citiesQuery.data?.total} onCreate={openCreate} />

        <CityFilters
          search={search}
          onSearchChange={setSearch}
          countryId={countryFilter}
          onCountryChange={setCountryFilter}
          countries={countries}
        />

        <CityTable
          cities={cities}
          isLoading={citiesQuery.isLoading}
          isError={citiesQuery.isError}
          onEdit={openEdit}
          onDelete={setCityToDelete}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </motion.div>

      <CityFormDialog
        open={createOpen}
        setOpen={setCreateOpen}
        name={name}
        setName={setName}
        nameUz={nameUz}
        setNameUz={setNameUz}
        nameRu={nameRu}
        setNameRu={setNameRu}
        countryId={countryId}
        setCountryId={setCountryId}
        countries={countries}
        onSubmit={handleCreate}
        loading={createMutation.isPending}
      />

      <CityFormDialog
        open={editCity !== null}
        setOpen={(v) => {
          if (!v) setEditCity(null);
        }}
        name={name}
        setName={setName}
        nameUz={nameUz}
        setNameUz={setNameUz}
        nameRu={nameRu}
        setNameRu={setNameRu}
        countryId={countryId}
        setCountryId={setCountryId}
        countries={countries}
        onSubmit={handleUpdate}
        loading={updateMutation.isPending}
        title="Shaharni tahrirlash"
      />

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
