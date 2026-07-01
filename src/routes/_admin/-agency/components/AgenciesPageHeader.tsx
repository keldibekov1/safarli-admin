import { Download, Loader2, Plus } from "lucide-react";

type Props = {
  onCreate: () => void;
  onExport: () => void;
  exporting?: boolean;
};

export function AgenciesPageHeader({ onCreate, onExport, exporting }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agencies</h1>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onExport}
          disabled={exporting}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium hover:bg-muted disabled:opacity-60"
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}{" "}
          Eksport
        </button>
        <button
          onClick={onCreate}
          className="inline-flex h-10 items-center gap-2 rounded-xl gradient-primary px-4 text-sm font-semibold text-white shadow-soft hover:shadow-glow"
        >
          <Plus className="h-4 w-4" /> Yangi agency
        </button>
      </div>
    </div>
  );
}
