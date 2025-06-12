"use client";

import { useState } from 'react';
import { Outfit } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Footer from '@/components/layout/Footer';
import TermsModal from '@/components/legal/TermsModal';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isTermsModalOpen, setTermsModalOpen] = useState(false);
  
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900 flex flex-col min-h-screen`}>
        <ThemeProvider>
          <Toaster
            position="top-center"
            reverseOrder={false}
          />
          <SidebarProvider>
            <main className="flex-grow">{children}</main>
            <Footer onOpenTermsModal={() => setTermsModalOpen(true)} />
          </SidebarProvider>
        </ThemeProvider>
        <TermsModal isOpen={isTermsModalOpen} onClose={() => setTermsModalOpen(false)} />
      </body>
    </html>
  );
}
