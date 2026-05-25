import { createFileRoute } from "@tanstack/react-router";
import TourFeaturesPage from "./tourfeature/page";

export const Route = createFileRoute("/_admin/tour-features")({
  component: TourFeaturesRoute,
});

function TourFeaturesRoute() {

  return < TourFeaturesPage/>;
}
