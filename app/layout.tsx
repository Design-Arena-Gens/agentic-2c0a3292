import './globals.css';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Modern Residential Fa?ade ? 8K Render',
  description:
    'Photorealistic modern fa?ade: concrete, glass, metal, wood with geometric boxes, vertical fins, subtle linear LEDs. Render up to 8K.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }]
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
