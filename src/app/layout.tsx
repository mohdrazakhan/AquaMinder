import './styles/globals.css';
import React from 'react';
import NavBar from '@/components/ui/NavBar';
import Footer from '@/components/ui/Footer';
import MobileBottomNav from '@/components/ui/MobileBottomNav';
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: 'Aqua Minder',
  description: 'Smart water monitoring for homes',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Aqua Minder',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* lightweight font link */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" />
      </head>
      <body className="flex flex-col min-h-screen items-center bg-white">
        <NavBar />
        <main className="flex-1 w-full flex flex-col items-center">
          <div className="w-full max-w-7xl px-4">{children}</div>
        </main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
