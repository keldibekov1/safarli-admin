import { type City } from "@/api/city";

import CityTableRow from "./CityTableRow";
import CityTableLoading from "./CityTableLoading";
import CityTableEmpty from "./CityTableEmpty";

type Props = {
  cities: City[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (city: City) => void;
  onDelete: (city: City) => void;
};

export default function CityTable({
  cities,
  isLoading,
  isError,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted/40">
          <tr>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Shahar
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Nomi (UZ)
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Nomi (RU)
            </th>

            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Davlat
            </th>

            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Amal
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {isLoading && <CityTableLoading />}

          {isError && (
            <tr>
              <td colSpan={5} className="px-5 py-12 text-center text-sm text-destructive">
                Shaharlarni yuklashda xatolik yuz berdi.
              </td>
            </tr>
          )}

          {!isLoading &&
            !isError &&
            cities.map((city, index) => (
              <CityTableRow
                key={city.id}
                city={city}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}

          {!isLoading && !isError && cities.length === 0 && (
            <CityTableEmpty />
          )}
        </tbody>
      </table>
    </div>
  );
}