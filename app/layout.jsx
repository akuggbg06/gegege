import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Zexzo Storage',
  description: 'Premium Image Storage Solution',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <div className="animate-fade-in">
          {children}
        </div>
      </body>
    </html>
  );
}
