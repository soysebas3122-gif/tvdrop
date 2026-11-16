import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TVDrop — Envía APKs a tu Android TV',
  description: 'Sube archivos desde tu teléfono y descárgalos en tu TV con Downloader.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
