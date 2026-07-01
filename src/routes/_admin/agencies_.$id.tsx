import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Pause,
  Pencil,
  Phone,
  Play,
  Send,
  Star,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { assetUrl } from "@/api/api";
import { type CreateAgencyDto } from "@/api/agencies";
import {
  useAgencyQuery,
  useDeleteAgencyMutation,
  useRegionsQuery,
  useUpdateAgencyMutation,
  useUpdateAgencyStatusMutation,
} from "@/services/agencies";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/date";

import AgencyFormDialog from "./-agency/components/AgencyFormDialog";

export const Route = createFileRoute("/_admin/agencies_/$id")({
  component: AgencyDetailPage,
});

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Phone;
  label: string;
  value: string | null | undefined;
  href?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="break-words font-medium text-primary hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="break-words font-medium">{value}</p>
        )}
      </div>
    </div>
  );
}

function AgencyDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const { data: agency, isLoading, isError } = useAgencyQuery(id);
  const regionsQuery = useRegionsQuery();

  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const updateMutation = useUpdateAgencyMutation({
    onSuccess: () => {
      toast.success("Agentlik yangilandi");
      setEditOpen(false);
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const statusMutation = useUpdateAgencyStatusMutation({
    onSuccess: (a) =>
      toast.success(
        a.isActive ? "Agentlik faollashtirildi" : "Agentlik to'xtatildi",
      ),
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  const deleteMutation = useDeleteAgencyMutation({
    onSuccess: () => {
      toast.success("Agentlik o'chirildi");
      navigate({ to: "/agencies", search: { page: 1, limit: 10 } });
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  if (isLoading) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        Yuklanmoqda...
      </div>
    );
  }

  if (isError || !agency) {
    return (
      <div className="space-y-4 py-20 text-center">
        <p className="text-sm text-destructive">Agentlik topilmadi.</p>
        <Link
          to="/agencies"
          search={{ page: 1, limit: 10 }}
          className="text-sm text-primary hover:underline"
        >
          ← Agentliklar ro'yxatiga qaytish
        </Link>
      </div>
    );
  }

  const handleSubmit = (data: CreateAgencyDto) => {
    updateMutation.mutate({ id: agency.id, data });
  };

  const hasLocation = agency.latitude != null && agency.longitude != null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <Link
          to="/agencies"
          search={{ page: 1, limit: 10 }}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Orqaga
        </Link>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              statusMutation.mutate({ id: agency.id, isActive: !agency.isActive })
            }
            disabled={statusMutation.isPending}
          >
            {agency.isActive ? (
              <>
                <Pause className="mr-2 h-4 w-4" /> To'xtatish
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" /> Faollashtirish
              </>
            )}
          </Button>

          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" /> Tahrirlash
          </Button>

          <Button
            variant="destructive"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> O'chirish
          </Button>
        </div>
      </div>

      {/* Banner + identity */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="relative h-40 w-full bg-muted sm:h-56">
          {agency.bannerImage ? (
            <img
              src={assetUrl(agency.bannerImage)}
              alt={`${agency.name} banner`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full gradient-primary opacity-20" />
          )}
        </div>

        <div className="flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end">
          <div className="-mt-10 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-card bg-muted shadow-soft">
            {agency.logo ? (
              <img
                src={assetUrl(agency.logo)}
                alt={`${agency.name} logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">
                {agency.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1 sm:pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{agency.name}</h1>
              <span
                className={cn(
                  "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                  agency.isActive
                    ? "border-success/30 bg-success/15 text-success"
                    : "border-destructive/30 bg-destructive/15 text-destructive",
                )}
              >
                {agency.isActive ? "Faol" : "Faol emas"}
              </span>
              {agency.isFeatured && (
                <span className="inline-flex rounded-full border border-warning/30 bg-warning/15 px-2.5 py-0.5 text-[11px] font-semibold text-warning">
                  Featured
                </span>
              )}
            </div>
            <p className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-warning" /> {agency.rating}
              </span>
              <span>{agency.reviewsCount} ta sharh</span>
            </p>
          </div>
        </div>

        {agency.description && (
          <p className="border-t border-border px-5 py-4 text-sm text-muted-foreground">
            {agency.description}
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contacts & credentials */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Aloqa
            </h2>
            <div className="divide-y divide-border">
              <InfoRow icon={Phone} label="Telefon" value={agency.phone} href={`tel:${agency.phone}`} />
              <InfoRow icon={Mail} label="Email" value={agency.email} href={`mailto:${agency.email}`} />
              <InfoRow
                icon={Globe}
                label="Veb-sayt"
                value={agency.website}
                href={agency.website ? (agency.website.startsWith("http") ? agency.website : `https://${agency.website}`) : undefined}
              />
              <InfoRow icon={Send} label="Telegram" value={agency.telegram} href={agency.telegram ?? undefined} />
              <InfoRow icon={Instagram} label="Instagram" value={agency.instagram} href={agency.instagram ?? undefined} />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Hisob
            </h2>
            <div className="divide-y divide-border">
              <InfoRow icon={User} label="Login" value={agency.username} />
              <InfoRow
                icon={MapPin}
                label="Oxirgi kirish"
                value={agency.lastLogin ? formatDateTime(agency.lastLogin) : "—"}
              />
            </div>
            <div className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
              <p>Yaratilgan: {formatDateTime(agency.createdAt)}</p>
              <p>Yangilangan: {formatDateTime(agency.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Manzil
          </h2>
          <div className="divide-y divide-border">
            <InfoRow icon={MapPin} label="Viloyat" value={agency.region?.name} />
            <InfoRow icon={MapPin} label="Manzil" value={agency.address} />
          </div>

          {hasLocation && (
            <div className="mt-3 overflow-hidden rounded-xl border border-border">
              <iframe
                title="Agentlik lokatsiyasi"
                className="h-64 w-full"
                src={`https://yandex.com/map-widget/v1/?ll=${agency.longitude}%2C${agency.latitude}&z=16&pt=${agency.longitude}%2C${agency.latitude}%2Cpm2rdm`}
              />
            </div>
          )}
        </div>
      </div>

      <AgencyFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        agency={agency}
        regions={regionsQuery.data ?? []}
        loading={updateMutation.isPending}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Agentlikni o'chirish"
        description={`${agency.name} agentligini o'chirishni tasdiqlaysizmi? Bu amalni ortga qaytarib bo'lmaydi.`}
        confirmText="O'chirish"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(agency.id)}
      />
    </motion.div>
  );
}
