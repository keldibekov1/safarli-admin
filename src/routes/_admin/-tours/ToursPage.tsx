import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import Pagination from "@/components/admin/Pagination";
import { useDebounce } from "@/hooks/use-debounce";

import { type Tour, type TourStatus } from "@/api/tours";
import { useToursQuery, useUpdateTourStatusMutation } from "@/services/tours";
import { useAllCountriesQuery } from "@/services/countries";
import { useAllCitiesQuery } from "@/services/city";
import { useAllAgenciesQuery } from "@/services/agencies";

import TourFilters from "./components/TourFilters";
import ToursTable from "./components/ToursTable";
import RejectTourDialog from "./components/RejectTourDialog";
import TourDetailDialog from "./components/TourDetailDialog";

const LIMIT = 10;

export default function ToursPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TourStatus | "">("");
  const [countryId, setCountryId] = useState("");
  const [cityId, setCityId] = useState("");
  const [agencyId, setAgencyId] = useState("");

  const [detailTour, setDetailTour] = useState<Tour | null>(null);
  const [tourToReject, setTourToReject] = useState<Tour | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, countryId, cityId, agencyId]);

  // clear the city filter when the country changes
  useEffect(() => {
    setCityId("");
  }, [countryId]);

  const countriesQuery = useAllCountriesQuery();
  const citiesQuery = useAllCitiesQuery(countryId);
  const agenciesQuery = useAllAgenciesQuery();

  const toursQuery = useToursQuery({
    page,
    limit: LIMIT,
    search: debouncedSearch,
    status,
    countryId,
    cityId,
    agencyId,
  });

  const tours = toursQuery.data?.data ?? [];
  const totalPages = toursQuery.data?.totalPages ?? 1;

  const updateMutation = useUpdateTourStatusMutation();

  const closeAll = () => {
    setDetailTour(null);
    setTourToReject(null);
    setRejectReason("");
  };

  const handleApprove = (tour: Tour) => {
    updateMutation.mutate(
      { id: tour.id, data: { status: "APPROVED", rejectReason: null } },
      {
        onSuccess: () => {
          toast.success("Tur tasdiqlandi");
          closeAll();
        },
        onError: () => toast.error("Xatolik yuz berdi"),
      },
    );
  };

  const handleReject = () => {
    if (!tourToReject) return;

    updateMutation.mutate(
      {
        id: tourToReject.id,
        data: { status: "REJECTED", rejectReason: rejectReason.trim() },
      },
      {
        onSuccess: () => {
          toast.success("Tur rad etildi");
          closeAll();
        },
        onError: () => toast.error("Xatolik yuz berdi"),
      },
    );
  };

  const total = toursQuery.data?.total;

  const headerNote = useMemo(() => {
    if (total === undefined) return null;
    return `Jami: ${total} ta`;
  }, [total]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
      >
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-lg font-semibold">Turlar moderatsiyasi</h2>
          {headerNote && (
            <p className="mt-1 text-sm text-muted-foreground">{headerNote}</p>
          )}
        </div>

        <TourFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          countryId={countryId}
          onCountryChange={setCountryId}
          cityId={cityId}
          onCityChange={setCityId}
          agencyId={agencyId}
          onAgencyChange={setAgencyId}
          countries={countriesQuery.data ?? []}
          cities={citiesQuery.data ?? []}
          agencies={agenciesQuery.data ?? []}
        />

        <ToursTable
          tours={tours}
          isLoading={toursQuery.isLoading}
          isError={toursQuery.isError}
          onView={setDetailTour}
          onApprove={handleApprove}
          onReject={(tour) => {
            setRejectReason("");
            setTourToReject(tour);
          }}
        />

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </motion.div>

      <TourDetailDialog
        tour={detailTour}
        setTour={setDetailTour}
        onApprove={(tour) => {
          setDetailTour(null);
          handleApprove(tour);
        }}
        onReject={(tour) => {
          setDetailTour(null);
          setRejectReason("");
          setTourToReject(tour);
        }}
      />

      <RejectTourDialog
        tour={tourToReject}
        setTour={setTourToReject}
        reason={rejectReason}
        setReason={setRejectReason}
        onConfirm={handleReject}
        loading={updateMutation.isPending}
      />
    </div>
  );
}
