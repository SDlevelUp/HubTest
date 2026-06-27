"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

// Routes destinées aux clients : pas de sidebar admin.
const CLIENT_PREFIXES = ["/onboarding", "/espace"];

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isClient = CLIENT_PREFIXES.some((p) => pathname.startsWith(p));

  if (isClient) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 px-5 md:px-10 py-8">{children}</main>
    </div>
  );
}
