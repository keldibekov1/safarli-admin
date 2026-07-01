import { createFileRoute } from "@tanstack/react-router";
import ToursPage from "./-tours/ToursPage";

export const Route = createFileRoute("/_admin/tours")({
  component: ToursPage,
});
