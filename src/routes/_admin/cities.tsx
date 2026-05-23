import { createFileRoute } from "@tanstack/react-router";
import CitiesPage from "./city/page";

export const Route = createFileRoute("/_admin/cities")({
  component: CityRoute,
});

function CityRoute() {

  return <CitiesPage />;
}
