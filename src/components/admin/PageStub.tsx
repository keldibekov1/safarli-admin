import { Construction } from "lucide-react";
import { motion } from "framer-motion";

export function PageStub({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl border border-border bg-card shadow-soft" />
        ))}
      </div>

      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50 p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow">
          <Construction className="h-7 w-7 text-white" />
        </div>
        <h3 className="mt-6 text-lg font-semibold">{title} tez orada</h3>

      </div>
    </motion.div>
  );
}
