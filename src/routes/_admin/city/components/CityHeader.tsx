type Props = {
  total?: number;
};

export default function CityHeader({ total }: Props) {
  return (
    <div className="border-b border-border px-5 py-4">
      <h2 className="text-lg font-semibold">Shaharlar</h2>

      {total !== undefined && (
        <p className="mt-1 text-sm text-muted-foreground">
          Jami: {total} ta
        </p>
      )}
    </div>
  );
}