import type { Metadata } from "next";
import Sidebar from "@/components/layout/Sidebar";
import "./globals.css";
import MobileHeader from "@/components/layout/MobileHeader";

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
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col bg-sky-800">
        <main className="flex-1 w-full relative">
          <Sidebar />
          <MobileHeader />
          {children}
        </main>
      </body>
    </html>
  );
}
