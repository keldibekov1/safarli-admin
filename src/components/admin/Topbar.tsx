import { Bell, Menu, Moon, Search, Sun, Command } from "lucide-react";
import { useTheme } from "@/lib/theme";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Topbar({
  onMenuClick,
  onCommand,
}: {
  onMenuClick: () => void;
  onCommand: () => void;
}) {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl lg:px-6">
      <button
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <button
        onClick={onCommand}
        className="group flex h-10 flex-1 max-w-md items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 text-sm text-muted-foreground transition hover:bg-muted hover:shadow-soft"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Qidirish: agency, tour, booking...</span>
        <kbd className="hidden items-center gap-1 rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium sm:flex">
          <Command className="h-3 w-3" /> K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={toggle}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card hover:bg-muted"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card hover:bg-muted">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 flex h-2 w-2 rounded-full bg-destructive" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2">
            <DropdownMenuLabel className="px-2">Bildirishnomalar</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {[
              { t: "Yangi agency so'rovi", d: "Silk Road Travel ro'yxatdan o'tdi", time: "5 min" },
              { t: "Support ticket", d: "User #2841 yordam so'radi", time: "2 soat" },
            ].map((n) => (
              <DropdownMenuItem key={n.t} className="cursor-pointer rounded-xl p-3">
                <div>
                  <p className="text-sm font-medium">{n.t}</p>
                  <p className="text-xs text-muted-foreground">{n.d}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{n.time}</p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl border border-border bg-card p-1 pr-3 hover:bg-muted">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="gradient-primary text-xs font-semibold text-white">SA</AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-xs font-semibold leading-tight">Super Admin</p>
                <p className="text-[10px] text-muted-foreground">admin@safarli.uz</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-2xl">
            <DropdownMenuLabel>Mening hisobim</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Sozlamalar</DropdownMenuItem>
            <DropdownMenuItem>Audit logs</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Chiqish</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
