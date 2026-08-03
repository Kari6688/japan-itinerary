import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Karima · Japan Field Guide",
  description:
    "Personal Japan trip guide — Google Maps lists organised by neighbourhood.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0C0C0C",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-[#0C0C0C]">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased bg-[#0C0C0C] text-[#FCFAF2]`}
      >
        {children}
      </body>
    </html>
  );
}
