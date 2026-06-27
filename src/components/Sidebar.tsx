"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const groups: {
  title: string;
  links: { href: string; label: string; icon: React.ReactNode }[];
}[] = [
  {
    title: "Pilotage",
    links: [
      {
        href: "/",
        label: "Tableau de bord",
        icon: <path d="M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z" />,
      },
      {
        href: "/finances",
        label: "Pilotage & finances",
        icon: (
          <path
            d="M3 3v18h18M7 14l3-4 3 3 5-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ),
      },
    ],
  },
  {
    title: "Clients",
    links: [
      {
        href: "/clients",
        label: "Fiches clients",
        icon: <path d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Zm-4 2c-4 0-8 2-8 5v2h16v-2c0-3-4-5-8-5Z" />,
      },
    ],
  },
  {
    title: "Croissance",
    links: [
      {
        href: "/contenu",
        label: "Contenu & lancements",
        icon: (
          <path
            d="M4 4h16v12H5l-1 4V4Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        ),
      },
    ],
  },
  {
    title: "Organisation",
    links: [
      {
        href: "/taches",
        label: "Mes tâches",
        icon: (
          <path
            d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ),
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col bg-white border-r border-stone-200 px-4 py-6">
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white grid place-items-center font-serif font-bold">
          H
        </div>
        <div>
          <div className="font-serif text-lg font-semibold text-[#2a1d54] leading-tight">
            Mon Hub
          </div>
          <div className="text-[11px] text-stone-400">Pilotage d&apos;activité</div>
        </div>
      </div>

      <nav className="flex flex-col gap-6">
        {groups.map((g) => (
          <div key={g.title}>
            <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
              {g.title}
            </div>
            <div className="flex flex-col gap-1">
              {g.links.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : "text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] shrink-0" fill="currentColor">
                      {l.icon}
                    </svg>
                    {l.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto px-3 text-[11px] text-stone-400">
        Sans abonnement · données locales
      </div>
    </aside>
  );
}
