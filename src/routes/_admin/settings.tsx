import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/admin/PageStub";

export const Route = createFileRoute("/_admin/settings")({
  component: () => <PageStub title="Settings" description="Platforma sozlamalari, komissiya, to'lov shlyuzlari va integratsiyalar" />,
});
