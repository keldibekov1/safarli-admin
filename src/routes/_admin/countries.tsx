import { createFileRoute } from "@tanstack/react-router";
import { useCallback } from "react";
import CountriesPage from "./countries/countries";

export const Route = createFileRoute("/_admin/countries")({
  component: CountryRoute,
});

function CountryRoute() {

  return <CountriesPage />;
}
