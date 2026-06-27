import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Hub Pro — Pilotage",
  description: "Hub de pilotage personnel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full bg-[#faf6ef] text-[#1e1b3a] font-sans">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 md:ml-64 px-5 md:px-10 py-8 max-w-[1400px]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
