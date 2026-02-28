import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'FinTrack - Minimal Finance Dashboard',
  description: 'A clean, minimal personal finance tracker inspired by Upwork\'s design system.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.variable} font-sans antialiased bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
