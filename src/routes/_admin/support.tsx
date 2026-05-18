import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/admin/PageStub";

export const Route = createFileRoute("/_admin/support")({
  component: () => <PageStub title="Support Chats" description="Foydalanuvchilar bilan Telegram uslubidagi suhbatlar va ticket tizimi" />,
});
