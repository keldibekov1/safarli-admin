import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { type Country } from "@/api/countries";

import {
  useCountriesQuery,
  useCreateCountryMutation,
  useUpdateCountryMutation,
} from "@/services/countries";
import CountriesTable from "./components/CountriesTable";
import Pagination from "@/components/admin/Pagination";
import CountriesSearch from "./components/CountriesSearch";
import CreateCountryDialog from "./components/CreateCountryDialog";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";

export const Route = createFileRoute(
  "/_admin/countries/countries",
)({
  component: CountriesPage,
});

const countriesLimit = 10;

export default function CountriesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [countryToDelete, setCountryToDelete] =
    useState<Country | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [nameUz, setNameUz] = useState("");
  const [nameRu, setNameRu] = useState("");

  const [editCountry, setEditCountry] = useState<Country | null>(null);
  const [editName, setEditName] = useState("");
  const [editNameUz, setEditNameUz] = useState("");
  const [editNameRu, setEditNameRu] = useState("");

  // debounce
  const debouncedSearch = useDebounce(search, 500);

  // reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const countriesQuery = useCountriesQuery({
    page,
    limit: countriesLimit,
    search: debouncedSearch,
  });

  const countries = countriesQuery.data?.data ?? [];
  const totalPages = countriesQuery.data?.totalPages ?? 1;

  const createMutation = useCreateCountryMutation({
    onSuccess: () => {
      toast.success("Davlat qo'shildi");
      setCreateOpen(false);
      setName("");
      setNameUz("");
      setNameRu("");
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const handleCreate = () => {
    createMutation.mutate({
      name: name.trim(),
      nameUz: nameUz.trim() || null,
      nameRu: nameRu.trim() || null,
    });
  };

  const updateMutation = useUpdateCountryMutation({
    onSuccess: () => {
      toast.success("Davlat yangilandi");
      setEditCountry(null);
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const handleEdit = (country: Country) => {
    setEditCountry(country);
    setEditName(country.name);
    setEditNameUz(country.nameUz ?? "");
    setEditNameRu(country.nameRu ?? "");
  };

  const handleUpdate = () => {
    if (!editCountry) return;

    updateMutation.mutate({
      id: editCountry.id,
      data: {
        name: editName.trim(),
        nameUz: editNameUz.trim() || null,
        nameRu: editNameRu.trim() || null,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold">
                Davlatlar
              </h2>

              {countriesQuery.data && (
                <p className="mt-1 text-sm text-muted-foreground">
                  Jami: {countriesQuery.data.total} ta
                </p>
              )}
            </div>

            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Davlat qo'shish
            </Button>
          </div>

          <CountriesSearch
            value={search}
            onChange={setSearch}
          />

          <CountriesTable
            countries={countries}
            isLoading={countriesQuery.isLoading}
            isError={countriesQuery.isError}
            onEdit={handleEdit}
            onDelete={setCountryToDelete}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </motion.div>
      </div>

      <CreateCountryDialog
        open={createOpen}
        setOpen={setCreateOpen}
        name={name}
        setName={setName}
        nameUz={nameUz}
        setNameUz={setNameUz}
        nameRu={nameRu}
        setNameRu={setNameRu}
        onCreate={handleCreate}
        loading={createMutation.isPending}
      />

      <CreateCountryDialog
        open={editCountry !== null}
        setOpen={(v) => {
          if (!v) setEditCountry(null);
        }}
        name={editName}
        setName={setEditName}
        nameUz={editNameUz}
        setNameUz={setEditNameUz}
        nameRu={editNameRu}
        setNameRu={setEditNameRu}
        onCreate={handleUpdate}
        loading={updateMutation.isPending}
        title="Davlatni tahrirlash"
        submitLabel="Saqlash"
      />
    </div>
  );
}