import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";

import { getMe, setSession, updateMe, getToken, type Admin } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";

export const Route = createFileRoute("/_admin/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const meQuery = useQuery({
    queryKey: ["admin", "me"],
    queryFn: getMe,
    // A 401 here is handled globally by the axios interceptor (redirects to /login).
    retry: false,
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (meQuery.data) {
      setUsername(meQuery.data.username);
    }
  }, [meQuery.data]);

  const updateMutation = useMutation({
    mutationFn: () =>
      updateMe({
        username: username.trim(),
        ...(password.trim() ? { password: password.trim() } : {}),
      }),
    onSuccess: (admin: Admin) => {
      toast.success("Profil yangilandi");
      setPassword("");
      // keep the stored admin + token in sync
      const token = getToken();
      if (token) setSession({ token, admin });
      meQuery.refetch();
    },
    onError: () => toast.error("Xatolik yuz berdi"),
  });

  if (meQuery.isLoading) {
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-xl space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profil</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Admin hisobingiz ma'lumotlarini boshqaring
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary text-white">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <div>
          <p className="text-lg font-semibold">{meQuery.data?.username}</p>
          <p className="text-sm text-muted-foreground">Administrator</p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateMutation.mutate();
        }}
        className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-soft"
      >
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10"
              autoComplete="username"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Yangi parol</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="O'zgartirmaslik uchun bo'sh qoldiring"
            autoComplete="new-password"
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={updateMutation.isPending || !username.trim()}
          >
            {updateMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Saqlash
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
