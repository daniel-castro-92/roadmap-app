import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaSetup } from "@/components/PwaSetup";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#00695C",
};

export const metadata: Metadata = {
  title: "Roadmap",
  description: "Stratum project roadmap tracker",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Roadmap",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <PwaSetup />
      </body>
    </html>
  );
}
