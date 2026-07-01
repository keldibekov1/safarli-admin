import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type Agency,
  type CreateAgencyDto,
  type Region,
} from "@/api/agencies";

import YandexMapPicker from "./YandexMapPicker";
import ImageUploadField from "./ImageUploadField";

type FormValues = {
  name: string;
  description: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  regionId: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  logo: string;
  bannerImage: string;
  website: string;
  telegram: string;
  instagram: string;
};

const EMPTY: FormValues = {
  name: "",
  description: "",
  phone: "",
  email: "",
  username: "",
  password: "",
  regionId: "",
  address: "",
  latitude: null,
  longitude: null,
  logo: "",
  bannerImage: "",
  website: "",
  telegram: "",
  instagram: "",
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agency: Agency | null;
  regions: Region[];
  loading: boolean;
  onSubmit: (data: CreateAgencyDto) => void;
};

export default function AgencyFormDialog({
  open,
  onOpenChange,
  agency,
  regions,
  loading,
  onSubmit,
}: Props) {
  const isEdit = agency !== null;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: EMPTY });

  // Reset the form whenever the dialog opens (with the agency for edit).
  useEffect(() => {
    if (!open) return;

    if (agency) {
      reset({
        name: agency.name,
        description: agency.description ?? "",
        phone: agency.phone ?? "",
        email: agency.email ?? "",
        username: agency.username ?? "",
        password: "",
        regionId: agency.regionId ?? "",
        address: agency.address ?? "",
        latitude: agency.latitude,
        longitude: agency.longitude,
        logo: agency.logo ?? "",
        bannerImage: agency.bannerImage ?? "",
        website: agency.website ?? "",
        telegram: agency.telegram ?? "",
        instagram: agency.instagram ?? "",
      });
    } else {
      reset(EMPTY);
    }
  }, [open, agency, reset]);

  const regionId = watch("regionId");
  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const logo = watch("logo");
  const bannerImage = watch("bannerImage");

  const submit = handleSubmit((values) => {
    const dto: CreateAgencyDto = {
      name: values.name.trim(),
      description: values.description.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      username: values.username.trim(),
      regionId: values.regionId,
      address: values.address.trim(),
      latitude: values.latitude,
      longitude: values.longitude,
      logo: values.logo.trim() || null,
      bannerImage: values.bannerImage.trim() || null,
      website: values.website.trim() || null,
      telegram: values.telegram.trim() || null,
      instagram: values.instagram.trim() || null,
    };

    // Only send a password when one was entered.
    if (values.password.trim()) {
      dto.password = values.password.trim();
    }

    onSubmit(dto);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Agentlikni tahrirlash" : "Yangi agentlik"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Nomi *</Label>
              <Input
                {...register("name", { required: true })}
                placeholder="Asia Travel"
              />
              {errors.name && (
                <p className="text-xs text-destructive">Majburiy maydon</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Telefon *</Label>
              <Input
                {...register("phone", { required: true })}
                placeholder="+998901234567"
              />
              {errors.phone && (
                <p className="text-xs text-destructive">Majburiy maydon</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tavsif *</Label>
            <Textarea
              {...register("description", { required: true })}
              rows={3}
              placeholder="Agentlik haqida qisqacha..."
            />
            {errors.description && (
              <p className="text-xs text-destructive">Majburiy maydon</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                {...register("email", { required: true })}
                placeholder="info@agency.uz"
              />
              {errors.email && (
                <p className="text-xs text-destructive">Majburiy maydon</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Veb-sayt</Label>
              <Input {...register("website")} placeholder="https://agency.uz" />
            </div>

            <div className="space-y-2">
              <Label>Telegram</Label>
              <Input {...register("telegram")} placeholder="https://t.me/..." />
            </div>

            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input
                {...register("instagram")}
                placeholder="https://instagram.com/..."
              />
            </div>

            <ImageUploadField
              label="Logo"
              field="logo"
              value={logo}
              onChange={(url) => setValue("logo", url)}
            />

            <ImageUploadField
              label="Banner"
              field="bannerImage"
              value={bannerImage}
              onChange={(url) => setValue("bannerImage", url)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Viloyat *</Label>
              <Select
                value={regionId}
                onValueChange={(v) =>
                  setValue("regionId", v, { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Viloyatni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* hidden input keeps regionId in RHF + required validation */}
              <input
                type="hidden"
                {...register("regionId", { required: true })}
              />
              {errors.regionId && (
                <p className="text-xs text-destructive">Viloyatni tanlang</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Manzil *</Label>
              <Input
                {...register("address", { required: true })}
                placeholder="Amir Temur ko'chasi 45"
              />
              {errors.address && (
                <p className="text-xs text-destructive">Majburiy maydon</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Lokatsiya (xaritadan tanlang)</Label>
            <YandexMapPicker
              latitude={latitude}
              longitude={longitude}
              onChange={(lat, lng) => {
                setValue("latitude", lat);
                setValue("longitude", lng);
              }}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Latitude</Label>
                <Input
                  disabled
                  type="number"
                  step="any"
                  {...register("latitude", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Longitude</Label>
                <Input
                  disabled
                  type="number"
                  step="any"
                  {...register("longitude", { valueAsNumber: true })}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Login (username) *</Label>
              <Input
                autoComplete="off"
                {...register("username", { required: true })}
                placeholder="agencyadmin"
              />
              {errors.username && (
                <p className="text-xs text-destructive">Majburiy maydon</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{isEdit ? "Yangi parol" : "Parol *"}</Label>
              <Input
                type="password"
                autoComplete="new-password"
                {...register("password", { required: !isEdit })}
                placeholder={isEdit ? "O'zgartirmaslik uchun bo'sh qoldiring" : "••••••••"}
              />
              {errors.password && (
                <p className="text-xs text-destructive">Majburiy maydon</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Bekor qilish
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Saqlash
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
