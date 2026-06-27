"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/",
    label: "Tableau de bord",
    icon: (
      <path d="M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z" />
    ),
  },
  {
    href: "/finances",
    label: "Pilotage & finances",
    icon: (
      <path d="M3 3v18h18M7 14l3-4 3 3 5-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    href: "/clients",
    label: "Clients",
    icon: (
      <path d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Zm-4 2c-4 0-8 2-8 5v2h16v-2c0-3-4-5-8-5Z" />
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col bg-[#1e1b3a] text-white px-4 py-6">
      <div className="px-3 mb-8">
        <div className="font-serif text-xl font-semibold">Mon Hub</div>
        <div className="text-xs text-indigo-300 mt-0.5">Pilotage d&apos;activité</div>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-white/10 text-white font-medium"
                  : "text-indigo-200 hover:bg-white/5 hover:text-white"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 shrink-0"
                fill={active ? "currentColor" : "currentColor"}
              >
                {l.icon}
              </svg>
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto px-3 text-xs text-indigo-400">
        Sans abonnement · données locales
      </div>
    </aside>
  );
}
