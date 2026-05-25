import { Button } from "@/components/ui/button";
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Plus } from "lucide-react";

type Props = {
  count: number;
  onCreate: () => void;
};

export default function TourFeaturesHeader({ count, onCreate }: Props) {
  return (
    <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
      
      <div className="flex flex-col space-y-1">
        <CardTitle className="text-base">
          Tour Features
        </CardTitle>

        <CardDescription>
          Jami:{" "}
          <span className="font-medium text-foreground">
            {count}
          </span>{" "}
          ta
        </CardDescription>
      </div>

      <Button onClick={onCreate} className="gap-2 rounded-xl">
        <Plus className="h-4 w-4" />
        Create
      </Button>
    </CardHeader>
  );
}