import CountriesTableEmpty from "./CountriesTableEmpty";
import CountriesTableLoading from "./CountriesTableLoading";
import CountriesTableRow from "./CountriesTableRow";

import { type Country } from "@/api/countries";

type Props = {
  countries: Country[];

  isLoading: boolean;
  isError: boolean;

  onDelete: (country: Country) => void;
};

export default function CountriesTable({
  countries,
  isLoading,
  isError,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted/40">
          <tr>
            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Nomi
            </th>

            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Amal
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {isLoading && <CountriesTableLoading />}

          {isError && (
            <tr>
              <td
                colSpan={2}
                className="px-5 py-12 text-center text-sm text-destructive"
              >
                Davlatlarni yuklashda xatolik yuz berdi.
              </td>
            </tr>
          )}

          {!isLoading &&
            !isError &&
            countries.map((country, index) => (
              <CountriesTableRow
                key={country.id}
                country={country}
                index={index}
                onDelete={onDelete}
              />
            ))}

          {!isLoading &&
            !isError &&
            countries.length === 0 && (
              <CountriesTableEmpty />
            )}
        </tbody>
      </table>
    </div>
  );
}