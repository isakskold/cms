import type { Metadata } from "next";
import Sidebar from "@/components/layout/Sidebar";
import "./globals.css";
import MobileHeader from "@/components/layout/MobileHeader";
import RouteProtector from "@/components/utils/routeProtector";
import ThemeProvider from "@/components/utils/ThemeProvider";

export const metadata: Metadata = {
  title: "CMS",
  description: "Content management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-full">
      <body className="min-h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <ThemeProvider />
        <main className="flex flex-col w-[90vw] max-w-6xl mx-auto relative my-24">
          <RouteProtector />
          <Sidebar />
          <MobileHeader />
          {children}
        </main>
      </body>
    </html>
  );
}
