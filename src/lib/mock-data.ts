export type AgencyStatus = "active"  | "suspended";

export interface Agency {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  telegram: string;
  logo: string;
  status: AgencyStatus;
  revenue: number;
  toursCount: number;
  rating: number;
  joinedAt: string;
  city: string;
}

export interface Tour {
  id: string;
  title: string;
  destination: string;
  agencyId: string;
  agencyName: string;
  price: number;
  duration: number;
  status: "active" | "draft" | "archived";
  bookings: number;
  rating: number;
  featured: boolean;
  image: string;
}

const cities = ["Samarqand", "Buxoro", "Xiva", "Toshkent", "Farg'ona", "Namangan", "Nukus", "Shahrisabz"];
const ownerNames = [
  "Akmal Karimov", "Dilshod Yusupov", "Sherzod Rahimov", "Bobur Mirzayev",
  "Sardor Tursunov", "Jasur Nazarov", "Otabek Komilov", "Ravshan Sodiqov",
  "Aziz Toshmatov", "Farrux Eshonqulov", "Sanjar Abdullayev", "Ulug'bek Salimov",
];
const agencyNames = [
  "Silk Road Travel", "Samarkand Express", "Bukhara Voyage", "Khiva Adventures",
  "Tashkent Tours", "Uzbek Heritage", "Oasis Travel", "Caravan Trips",
  "Registan Travel", "Ferghana Discovery", "Aral Expeditions", "Pamir Adventures",
];

export const mockAgencies: Agency[] = Array.from({ length: 24 }).map((_, i) => {
  const name = agencyNames[i % agencyNames.length] + (i >= agencyNames.length ? ` ${Math.floor(i / agencyNames.length) + 1}` : "");
  const status: AgencyStatus = i % 11 === 0 ? "suspended" : "active";
  return {
    id: `agency-${i + 1}`,
    name,
    owner: ownerNames[i % ownerNames.length],
    email: `info@${name.toLowerCase().replace(/[^a-z0-9]/g, "")}.uz`,
    phone: `+998 ${90 + (i % 9)} ${100 + i}-${(i * 13) % 100}-${(i * 7) % 100}`.padEnd(0),
    telegram: `@${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
    logo: name.slice(0, 2).toUpperCase(),
    verified: status === "active" && i % 3 !== 0,
    status,
    revenue: 12_000_000 + ((i * 8_734_123) % 480_000_000),
    toursCount: 4 + ((i * 7) % 38),
    rating: Math.round((3.6 + ((i * 0.17) % 1.4)) * 10) / 10,
    joinedAt: new Date(2024, (i * 3) % 12, ((i * 5) % 27) + 1).toISOString(),
    city: cities[i % cities.length],
  };
});

const tourTitles = [
  "Samarqand Klassik Tur", "Buxoro Tarixiy Sayohat", "Xiva Sehrli Shahar",
  "Chimg'on Tog' Sarguzashtlari", "Orol Dengizi Ekspeditsiyasi", "Farg'ona Vodiysi Turi",
  "Ipak Yo'li Karvon Sayohati", "Shahrisabz Madaniyat Turi", "Nurota Cho'l Safari",
  "Sentyab Tog' Trekking", "Toshkent Shahar Turi", "Hazrati Imom Ziyorat",
];

export const mockTours: Tour[] = Array.from({ length: 40 }).map((_, i) => ({
  id: `tour-${i + 1}`,
  title: tourTitles[i % tourTitles.length],
  destination: cities[i % cities.length],
  agencyId: mockAgencies[i % mockAgencies.length].id,
  agencyName: mockAgencies[i % mockAgencies.length].name,
  price: 1_200_000 + ((i * 437_891) % 14_000_000),
  duration: 2 + (i % 12),
  status: i % 9 === 0 ? "draft" : i % 13 === 0 ? "archived" : "active",
  bookings: (i * 13) % 240,
  rating: Math.round((4 + ((i * 0.13) % 1)) * 10) / 10,
  featured: i % 6 === 0,
  image: `https://images.unsplash.com/photo-${1500000000000 + i * 1000}`,
}));

export const revenueData = [
  { month: "Yan", revenue: 124, bookings: 86 },
  { month: "Fev", revenue: 158, bookings: 102 },
  { month: "Mar", revenue: 192, bookings: 134 },
  { month: "Apr", revenue: 224, bookings: 168 },
  { month: "May", revenue: 287, bookings: 201 },
  { month: "Iyun", revenue: 312, bookings: 234 },
  { month: "Iyul", revenue: 398, bookings: 287 },
  { month: "Avg", revenue: 421, bookings: 312 },
  { month: "Sen", revenue: 376, bookings: 268 },
  { month: "Okt", revenue: 432, bookings: 298 },
  { month: "Noy", revenue: 487, bookings: 334 },
  { month: "Dek", revenue: 542, bookings: 389 },
];

export const newAgenciesData = [
  { week: "H1", count: 4 },
  { week: "H2", count: 7 },
  { week: "H3", count: 5 },
  { week: "H4", count: 9 },
  { week: "H5", count: 12 },
  { week: "H6", count: 8 },
  { week: "H7", count: 14 },
  { week: "H8", count: 11 },
];

export const destinationData = [
  { name: "Samarqand", value: 34 },
  { name: "Buxoro", value: 28 },
  { name: "Xiva", value: 18 },
  { name: "Toshkent", value: 12 },
  { name: "Boshqalar", value: 8 },
];

export const recentActivities = [
  { id: 1, type: "agency", title: "Silk Road Travel ro'yxatdan o'tdi", time: "2 daqiqa oldin", status: "new" },
  { id: 4, type: "support", title: "Yangi support ticket #2841", time: "1 soat oldin", status: "warning" },
  { id: 5, type: "review", title: "Xiva Adventures — 5★ baho", time: "2 soat oldin", status: "info" },
];

export const recentPayments = [
  { id: "PAY-2841", agency: "Silk Road Travel", amount: 18_500_000, status: "completed", date: "Bugun" },
  { id: "PAY-2840", agency: "Bukhara Voyage", amount: 12_300_000, status: "completed", date: "Bugun" },
  { id: "PAY-2839", agency: "Khiva Adventures", amount: 9_750_000, status: "pending", date: "Kecha" },
  { id: "PAY-2838", agency: "Registan Travel", amount: 24_100_000, status: "completed", date: "Kecha" },
  { id: "PAY-2837", agency: "Pamir Adventures", amount: 6_200_000, status: "failed", date: "2 kun" },
];

export const topAgencies = mockAgencies
  .filter((a) => a.status === "active")
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 5);

export const formatUZS = (n: number) =>
  new Intl.NumberFormat("uz-UZ").format(Math.round(n)) + " so'm";
