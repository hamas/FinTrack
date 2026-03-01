import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/lib/presentation/components/theme-provider';
import { UserProfileProvider } from '@/lib/presentation/context/user-profile-context';

export const metadata: Metadata = {
  title: 'FinTrack - Minimal Finance Dashboard',
  description: 'A clean, minimal personal finance tracker inspired by Upwork\'s design system.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@8..144,100..1000&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`font-sans antialiased transition-colors duration-300`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProfileProvider>
            {children}
          </UserProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
