import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { type User } from "@/api/users";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { formatDateTime } from "@/lib/date";
import { useDeleteUserMutation, useUsersQuery } from "@/services/users";

export const Route = createFileRoute("/_admin/users")({
  component: UsersPage,
});

const usersPage = 1;
const usersLimit = 10;

function UsersPage() {
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const usersQuery = useUsersQuery({ page: usersPage, limit: usersLimit });

  const users = usersQuery.data?.data ?? [];

  const deleteUserMutation = useDeleteUserMutation({
    onSuccess: () => {
      toast.success("Foydalanuvchi o'chirildi");
      setUserToDelete(null);
    },
    onError: () => {
      toast.error("Foydalanuvchini o'chirishda xatolik yuz berdi");
    },
  });

  const confirmDeleteUser = () => {
    if (!userToDelete) return;
    deleteUserMutation.mutate(userToDelete.id);
  };

  return (
    <div className="space-y-6">
      <div className="grid">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
        >
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold">Foydalanuvchilar</h2>
            {usersQuery.data && (
              <p className="mt-1 text-sm text-muted-foreground">Jami: {usersQuery.data.total} ta</p>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/40">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Ism
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Telefon raqam
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Royxatdan o`tgan vaqti
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Oxirgi kirish vaqti
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Amal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {usersQuery.isLoading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-sm text-muted-foreground"
                    >
                      Yuklanmoqda...
                    </td>
                  </tr>
                )}

                {usersQuery.isError && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-destructive">
                      Foydalanuvchilarni yuklashda xatolik yuz berdi.
                    </td>
                  </tr>
                )}

                {!usersQuery.isLoading &&
                  !usersQuery.isError &&
                  users.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="transition hover:bg-muted/30"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-sm font-bold text-white shadow-soft">
                            {user.name.slice(0, 1).toUpperCase()}
                          </div>
                          <span className="font-semibold">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{user.phone}</td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {formatDateTime(user.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">
                        {formatDateTime(user.lastLogin)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <button
                            onClick={() => setUserToDelete(user)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10"
                            aria-label={`${user.name}ni o'chirish`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}

                {!usersQuery.isLoading && !usersQuery.isError && users.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-sm text-muted-foreground"
                    >
                      Foydalanuvchilar topilmadi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {usersQuery.data && (
            <div className="flex items-center justify-between border-t border-border px-5 py-3">
              <p className="text-xs text-muted-foreground">
                Sahifa {usersQuery.data.currentPage} / {usersQuery.data.totalPages}
              </p>
              <p className="text-xs text-muted-foreground">Limit: {usersLimit}</p>
            </div>
          )}
        </motion.div>
      </div>
      <ConfirmDialog
        open={Boolean(userToDelete)}
        onOpenChange={(open) => {
          if (!open && !deleteUserMutation.isPending) {
            setUserToDelete(null);
          }
        }}
        title="Foydalanuvchini o'chirish"
        description={
          userToDelete
            ? `${userToDelete.name} foydalanuvchisini o'chirishni tasdiqlaysizmi? Bu amalni ortga qaytarib bo'lmaydi.`
            : ""
        }
        confirmText="O'chirish"
        isLoading={deleteUserMutation.isPending}
        onConfirm={confirmDeleteUser}
      />
    </div>
  );
}
