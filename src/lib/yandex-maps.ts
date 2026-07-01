// Minimal typings for the bits of the Yandex Maps 2.1 API we use.
export type YMaps = {
  ready: (cb: () => void) => void;
  Map: new (
    el: HTMLElement | string,
    state: { center: [number, number]; zoom: number; controls?: string[] },
    options?: Record<string, unknown>,
  ) => YMap;
  Placemark: new (
    coords: [number, number],
    properties?: Record<string, unknown>,
    options?: Record<string, unknown>,
  ) => YPlacemark;
  geocode: (
    request: string | [number, number],
    options?: Record<string, unknown>,
  ) => Promise<YGeocodeResult>;
};

export type YMap = {
  geoObjects: {
    add: (obj: unknown) => void;
    remove: (obj: unknown) => void;
  };
  events: { add: (type: string, cb: (e: YEvent) => void) => void };
  setCenter: (coords: [number, number], zoom?: number) => void;
  destroy: () => void;
};

export type YPlacemark = {
  geometry: { setCoordinates: (coords: [number, number]) => void };
  events: { add: (type: string, cb: (e: YEvent) => void) => void };
};

export type YEvent = {
  get: (key: string) => unknown;
};

export type YGeocodeResult = {
  geoObjects: {
    get: (i: number) =>
      | { geometry: { getCoordinates: () => [number, number] } }
      | undefined;
  };
};

declare global {
  interface Window {
    ymaps?: YMaps;
  }
}

const API_KEY = import.meta.env.VITE_YANDEX_MAPS_API_KEY as string | undefined;

let loaderPromise: Promise<YMaps> | null = null;

export function loadYandexMaps(): Promise<YMaps> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Yandex Maps faqat brauzerda ishlaydi"));
  }

  if (window.ymaps) {
    return new Promise((resolve) => window.ymaps!.ready(() => resolve(window.ymaps!)));
  }

  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise<YMaps>((resolve, reject) => {
    const script = document.createElement("script");
    const keyParam = API_KEY ? `apikey=${API_KEY}&` : "";
    script.src = `https://api-maps.yandex.ru/2.1/?${keyParam}lang=ru_RU`;
    script.async = true;
    script.onload = () => {
      if (!window.ymaps) {
        reject(new Error("Yandex Maps yuklanmadi"));
        return;
      }
      window.ymaps.ready(() => resolve(window.ymaps!));
    };
    script.onerror = () => reject(new Error("Yandex Maps yuklanmadi"));
    document.head.appendChild(script);
  });

  return loaderPromise;
}
