"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Tableau de bord" },
  { href: "/finances", label: "Pilotage & finances" },
  { href: "/clients", label: "Clients" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
        <span className="font-serif text-lg font-semibold text-indigo-900">Mon Hub</span>
        <nav className="flex gap-4 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                pathname === l.href
                  ? "text-indigo-900 font-medium"
                  : "text-stone-500 hover:text-indigo-900"
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
