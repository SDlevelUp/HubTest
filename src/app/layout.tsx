import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "SDlevelUp — Hub",
  description: "Hub de pilotage SDlevelUp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Outfit:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-[#f5efeb] text-[#0a0a0a] font-sans">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 md:ml-64 px-5 md:px-10 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
