import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { type TourFeature } from "@/api/tour-features";

import {
  useCreateTourFeatureMutation,
  useDeleteTourFeatureMutation,
  useTourFeaturesQuery,
  useUpdateTourFeatureMutation,
} from "@/services/tour-features";

import TourFeaturesHeader from "./components/TourFeaturesHeader";
import TourFeaturesTable from "./components/TourFeaturesTable";
import CreateTourFeatureDialog from "./components/CreateTourFeatureDialog";
import DeleteTourFeatureDialog from "./components/DeleteTourFeatureDialog";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_admin/tourfeature/page")({
  component: TourFeaturesPage,
});

export default function TourFeaturesPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState<TourFeature | null>(null);
  const [featureToEdit, setFeatureToEdit] = useState<TourFeature | null>(null);

  const [name, setName] = useState("");
  const [editName, setEditName] = useState("");

  const tourFeaturesQuery = useTourFeaturesQuery();
  const features = tourFeaturesQuery.data ?? [];

  const createMutation = useCreateTourFeatureMutation({
    onSuccess: () => {
    toast.success("Muvaffaqiyatli qo'shildi");
      setCreateOpen(false);
      setName("");
    },
    onError: () => toast.error("Xatolik"),
  });

  const updateMutation = useUpdateTourFeatureMutation({
    onSuccess: () => {
      toast.success("Muvaffaqiyatli yangilandi");
      setFeatureToEdit(null);
    },
    onError: () => toast.error("Xatolik"),
  });

  const openEdit = (feature: TourFeature) => {
    setFeatureToEdit(feature);
    setEditName(feature.name);
  };

  const deleteMutation = useDeleteTourFeatureMutation({
    onSuccess: () => {
      toast.success("Muvaffaqiyatli o'chirildi");
      setFeatureToDelete(null);
    },
    onError: () => toast.error("Xatolik"),
  });

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-2xl">
        <TourFeaturesHeader count={features.length} onCreate={() => setCreateOpen(true)} />

        <TourFeaturesTable
          features={features}
          isLoading={tourFeaturesQuery.isLoading}
          isError={tourFeaturesQuery.isError}
          onEdit={openEdit}
          onDelete={setFeatureToDelete}
        />
      </Card>

      <CreateTourFeatureDialog
        open={createOpen}
        setOpen={setCreateOpen}
        name={name}
        setName={setName}
        onCreate={() => createMutation.mutate({ name })}
        loading={createMutation.isPending}
      />

      <CreateTourFeatureDialog
        open={featureToEdit !== null}
        setOpen={(v) => {
          if (!v) setFeatureToEdit(null);
        }}
        name={editName}
        setName={setEditName}
        onCreate={() =>
          featureToEdit &&
          updateMutation.mutate({
            id: featureToEdit.id,
            data: { name: editName },
          })
        }
        loading={updateMutation.isPending}
        title="Edit Tour Feature"
      />

      <DeleteTourFeatureDialog
        feature={featureToDelete}
        setFeature={setFeatureToDelete}
        onConfirm={() => featureToDelete && deleteMutation.mutate(featureToDelete.id)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
