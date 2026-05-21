import React, { type ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#4F46E5",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Credixa - Your Financial Hub",
  description: "Fast and secure financial management for Credixa.",
  manifest: "/manifest.json", // Link to your PWA manifest
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Credixa' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
     <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head />
      <body className="antialiased bg-white text-black dark:bg-black dark:text-white transition-colors duration-300 selection:bg-indigo-100 dark:selection:bg-indigo-500/30">
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
        >
          {`
            try {
              var prefs = JSON.parse(localStorage.getItem('prefs'));
              var theme = prefs ? prefs.theme : 'dark';
              if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {}
          `}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
