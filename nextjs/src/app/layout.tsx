import type { Metadata } from "next";
import "./globals.css";

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
        <main className="flex-1 w-full">{children}</main>
      </body>
    </html>
  );
}
