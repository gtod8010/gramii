import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Footer from '@/components/layout/Footer';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900 flex flex-col min-h-screen`}>
        <ThemeProvider>
          <SidebarProvider>
            <main className="flex-grow">{children}</main>
            <Footer />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
