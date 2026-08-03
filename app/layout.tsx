import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { TripProvider } from "@/lib/trip-store";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Karima · Japan Trip",
  description:
    "Your Google Maps lists for Japan — temples, museums, and food — organised by neighbourhood.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full`}>
      <body className="min-h-full antialiased">
        <TripProvider>{children}</TripProvider>
      </body>
    </html>
  );
}
