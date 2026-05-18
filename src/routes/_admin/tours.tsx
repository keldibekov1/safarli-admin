import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/admin/PageStub";

export const Route = createFileRoute("/_admin/tours")({
  component: () => <PageStub title="Tours" description="Platformadagi barcha turlarni moderatsiya qiling va featured turlarni boshqaring" />,
});
