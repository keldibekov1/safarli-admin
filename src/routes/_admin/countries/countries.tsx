import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { type Country } from "@/api/countries";

import { useCountriesQuery } from "@/services/countries";
import CountriesTable from "./components/CountriesTable";
import Pagination from "@/components/admin/Pagination";
import CountriesSearch from "./components/CountriesSearch";
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

  return (
    <div className="space-y-6">
      <div className="grid">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
        >
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold">
              Davlatlar
            </h2>

            {countriesQuery.data && (
              <p className="mt-1 text-sm text-muted-foreground">
                Jami: {countriesQuery.data.total} ta
              </p>
            )}
          </div>

          <CountriesSearch
            value={search}
            onChange={setSearch}
          />

          <CountriesTable
            countries={countries}
            isLoading={countriesQuery.isLoading}
            isError={countriesQuery.isError}
            onDelete={setCountryToDelete}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </motion.div>
      </div>
    </div>
  );
}