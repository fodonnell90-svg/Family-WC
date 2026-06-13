import type { Metadata, Viewport } from "next";
import { Archivo, Unbounded } from "next/font/google";
import "@/app/globals.css";

const unbounded = Unbounded({ subsets: ["latin"], variable: "--font-display" });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "World Cup 2026 Sweepstake",
  description: "Live standings for a 2026 World Cup sweepstake.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#06120c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${unbounded.variable} ${archivo.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
