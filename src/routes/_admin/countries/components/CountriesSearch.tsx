type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function CountriesSearch({
  value,
  onChange,
}: Props) {
  return (
    <div className="px-5 py-3 border-b border-border">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Davlat qidirish..."
        className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}