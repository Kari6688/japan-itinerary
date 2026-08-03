import type { Metadata, Viewport } from "next";
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
  themeColor: "#F4F5F8",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-[#F4F5F8]">
      <body className="antialiased bg-[#F4F5F8] text-[#16162A]">{children}</body>
    </html>
  );
}
