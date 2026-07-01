import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  total?: number;
  onCreate: () => void;
};

export default function CityHeader({ total, onCreate }: Props) {
  return (
    <div className="flex items-center justify-between border-b border-border px-5 py-4">
      <div>
        <h2 className="text-lg font-semibold">Shaharlar</h2>

        {total !== undefined && (
          <p className="mt-1 text-sm text-muted-foreground">
            Jami: {total} ta
          </p>
        )}
      </div>

      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Shahar qo'shish
      </Button>
    </div>
  );
}
