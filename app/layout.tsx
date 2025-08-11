import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Oregon SMB Directory - Find Local Businesses Along I-5',
  description: 'Complete directory of verified businesses from Portland to Ashland along the I-5 corridor. Find electricians, plumbers, contractors and more.',
  keywords: 'Oregon business directory, I-5 corridor, Portland electricians, Salem plumbers, Medford contractors',
  authors: [{ name: 'LEVERAGEAI LLC' }],
  creator: 'LEVERAGEAI LLC',
  publisher: 'LEVERAGEAI LLC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}