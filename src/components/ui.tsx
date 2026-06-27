import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  hint,
  accent = "indigo",
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: "indigo" | "green" | "amber" | "rose";
  icon?: ReactNode;
}) {
  const accents: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
  };
  return (
    <div className="bg-white rounded-2xl border border-stone-200/70 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="text-sm text-stone-500">{label}</div>
        {icon && (
          <div className={`w-9 h-9 rounded-xl grid place-items-center ${accents[accent]}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="text-3xl font-semibold text-[#1e1b3a] mt-3 tracking-tight">
        {value}
      </div>
      {hint && <div className="text-xs text-stone-400 mt-1">{hint}</div>}
    </div>
  );
}

export function Card({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-stone-200/70 p-5 shadow-sm ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="font-semibold text-[#1e1b3a]">{title}</h2>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function BarChart({
  data,
  format = (n) => n.toString(),
}: {
  data: { label: string; value: number }[];
  format?: (n: number) => string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex items-stretch gap-2 h-48">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-2 h-full">
          <div className="w-full flex-1 flex flex-col justify-end">
            {d.value > 0 && (
              <div className="text-[9px] text-center text-stone-400 mb-1">
                {format(d.value)}
              </div>
            )}
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-indigo-700 to-indigo-400"
              style={{
                height: `${Math.max((d.value / max) * 100, d.value > 0 ? 3 : 0)}%`,
              }}
              title={format(d.value)}
            />
          </div>
          <div className="text-[10px] text-stone-400">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

export function eur(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}
