import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { type TourFeature } from "@/api/tour-features";

type Props = {
  feature: TourFeature | null;
  setFeature: (v: null) => void;
  onConfirm: () => void;
  loading: boolean;
};

export default function DeleteTourFeatureDialog({
  feature,
  setFeature,
  onConfirm,
  loading,
}: Props) {
  return (
    <ConfirmDialog
      open={Boolean(feature)}
      onOpenChange={(open) => {
        if (!open && !loading) setFeature(null);
      }}
      title="O'chirishni tasdiqlash"
      description={
        feature
          ? `"${feature.name}" ni o'chirishga ishonchingiz komilmi? Bu amalni ortga qaytarib bo'lmaydi.`
          : ""
      }
      confirmText="O'chirish"
      isLoading={loading}
      onConfirm={onConfirm}
    />
  );
}