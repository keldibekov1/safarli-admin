import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Building2, Compass,  CalendarCheck, Clock, Activity,
  TrendingUp, ArrowUpRight, MoreHorizontal, MapPin,
  User,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import {
  newAgenciesData,
  recentActivities, recentPayments, topAgencies, formatUZS,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useMonthlyUserStatsQuery } from "@/services/users";

export const Route = createFileRoute("/_admin/")({
  component: DashboardPage,
});

const stats = [
  { label: "Jami Agencies", value: "248", change: "+12.5%", icon: Building2, tone: "primary" },
  { label: "Faol Tours", value: "1,842", change: "+8.2%", icon: Compass, tone: "accent" },
  { label: "Jami Users", value: "5,678", change: "+15.3%", icon: User, tone: "warning" },
  { label: "Online Users", value: "1,284", change: "Live", icon: Activity, tone: "success" },

] as const;

const toneMap = {
  primary: "from-primary/15 to-primary/5 text-primary",
  accent: "from-accent/15 to-accent/5 text-accent",
  success: "from-success/15 to-success/5 text-success",
  warning: "from-warning/15 to-warning/5 text-warning",
};

const PIE_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

function DashboardPage() {
  const currentYear = new Date().getFullYear();
  const monthlyStatsQuery = useMonthlyUserStatsQuery(currentYear);
  const newUsersData = monthlyStatsQuery.data?.data ?? [];

  return (
    <div className="space-y-6">
   

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elegant"
            >
              <div className={cn("absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-60", toneMap[s.tone])} />
              <div className="relative flex items-center justify-between">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br", toneMap[s.tone])}>
                  <Icon className="h-5 w-5" />
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-4 text-xs font-medium text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight">{s.value}</p>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-success">
                <TrendingUp className="h-3 w-3" />
                {s.change}
              </div>
            </motion.div>
          );
        })}
      </div>

 

      {/* New agencies + New users */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h3 className="text-lg font-semibold">Yangi agencies</h3>
          <p className="text-xs text-muted-foreground">Haftalik dinamika</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={newAgenciesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">New users</h3>
            <span className="text-xs font-medium text-muted-foreground">
              {currentYear} · {monthlyStatsQuery.data?.total ?? 0} ta
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Oylik o'sish</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={newUsersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="count" name="Yangi userlar" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activities + Top agencies  */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">So'nggi faollik</h3>
            <button className="text-xs font-medium text-accent hover:underline">Hammasi →</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-3"
              >
                <div className={cn(
                  "mt-1 h-2 w-2 shrink-0 rounded-full",
                  a.status === "success" && "bg-success",
                  a.status === "warning" && "bg-warning",
                  a.status === "new" && "bg-accent",
                  a.status === "pending" && "bg-warning",
                  a.status === "info" && "bg-chart-3",
                )} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Top agencies</h3>
            <button className="text-xs font-medium text-accent hover:underline">Ko'rish →</button>
          </div>
          <div className="space-y-3">
            {topAgencies.map((a, i) => (
              <div key={a.id} className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-muted/50">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary text-xs font-bold text-white">
                  {a.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.toursCount} tours · ⭐ {a.rating}</p>
                </div>
            
              </div>
            ))}
          </div>
        </div>

    
      </div>
    </div>
  );
}
