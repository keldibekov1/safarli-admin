import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  loadYandexMaps,
  type YMap,
  type YPlacemark,
} from "@/lib/yandex-maps";

// Tashkent center as a sensible default.
const DEFAULT_CENTER: [number, number] = [41.311081, 69.240562];

type Props = {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
};

export default function YandexMapPicker({
  latitude,
  longitude,
  onChange,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<YMap | null>(null);
  const placemarkRef = useRef<YPlacemark | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadYandexMaps()
      .then((ymaps) => {
        if (cancelled || !containerRef.current) return;

        const initial: [number, number] =
          latitude != null && longitude != null
            ? [latitude, longitude]
            : DEFAULT_CENTER;

        const map = new ymaps.Map(containerRef.current, {
          center: initial,
          zoom: 12,
          controls: ["zoomControl", "geolocationControl"],
        });

        const placemark = new ymaps.Placemark(
          initial,
          {},
          { draggable: true, preset: "islands#redDotIcon" },
        );

        map.geoObjects.add(placemark);

        const commit = (coords: [number, number]) => {
          onChangeRef.current(coords[0], coords[1]);
        };

        map.events.add("click", (e) => {
          const coords = e.get("coords") as [number, number];
          placemark.geometry.setCoordinates(coords);
          commit(coords);
        });

        placemark.events.add("dragend", () => {
          const coords = (
            placemark as unknown as {
              geometry: { getCoordinates: () => [number, number] };
            }
          ).geometry.getCoordinates();
          commit(coords);
        });

        mapRef.current = map;
        placemarkRef.current = placemark;
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      mapRef.current?.destroy();
      mapRef.current = null;
      placemarkRef.current = null;
    };
    // Initialise once; marker position is synced via the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the marker in sync when lat/lng change from outside (e.g. opening edit).
  useEffect(() => {
    if (status !== "ready" || latitude == null || longitude == null) return;
    const coords: [number, number] = [latitude, longitude];
    placemarkRef.current?.geometry.setCoordinates(coords);
    mapRef.current?.setCenter(coords);
  }, [latitude, longitude, status]);

  const handleSearch = async () => {
    if (!query.trim() || !window.ymaps) return;
    setSearching(true);
    try {
      const res = await window.ymaps.geocode(query.trim(), { results: 1 });
      const first = res.geoObjects.get(0);
      if (first) {
        const coords = first.geometry.getCoordinates();
        placemarkRef.current?.geometry.setCoordinates(coords);
        mapRef.current?.setCenter(coords, 14);
        onChangeRef.current(coords[0], coords[1]);
      }
    } finally {
      setSearching(false);
    }
  };

  if (status === "error") {
    return (
      <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
        Xarita yuklanmadi. Koordinatalarni qo'lda kiriting yoki{" "}
        <code className="text-foreground">VITE_YANDEX_MAPS_API_KEY</code> ni
        sozlang.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            placeholder="Manzilni qidiring..."
            className="pl-10"
          />
        </div>
        <Button type="button" variant="outline" onClick={handleSearch} disabled={searching}>
          {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Qidirish"}
        </Button>
      </div>

      <div className="relative h-64 w-full overflow-hidden rounded-xl border border-border">
        <div ref={containerRef} className="h-full w-full" />
        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/40">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        Xaritani bosing yoki markerni suring — koordinatalar avtomatik
        to'ldiriladi.
      </p>
    </div>
  );
}
