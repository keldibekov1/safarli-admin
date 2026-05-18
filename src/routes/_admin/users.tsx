import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { type FormEvent, useState } from "react";

export const Route = createFileRoute("/_admin/users")({
  component: UsersPage,
});

type User = {
  id: number;
  name: string;
  phone: string;
};

const initialUsers: User[] = [
  { id: 1, name: "Aziz Safarov", phone: "+998 90 123 45 67" },
  { id: 2, name: "Madina Karimova", phone: "+998 93 555 20 10" },
];

function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);

  function removeUser(id: number) {
    setUsers((current) => current.filter((user) => user.id !== id));
  }

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
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Amal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user, index) => (
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
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeUser(user.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10"
                          aria-label={`${user.name}ni o'chirish`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
