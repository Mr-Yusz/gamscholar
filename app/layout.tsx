import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GamScholar",
  description: "Scholarship discovery and management for Gambians.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-blue-800`}
      >
        <Providers>
          <div className="min-h-dvh bg-zinc-50 text-black dark:bg-black dark:text-zinc-50">
            <SiteHeader />
            <div className="mx-auto w-full max-w-6xl px-4 py-10">
              {children}
              </div>
              <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
