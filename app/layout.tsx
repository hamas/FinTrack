import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/lib/presentation/components/theme-provider';
import { UserProfileProvider } from '@/lib/presentation/context/user-profile-context';

/**
 * Global application metadata injected into the <head> of every page.
 */
export const metadata: Metadata = {
  title: 'FinTrack - Minimal Finance Dashboard',
  description: 'A clean, minimal personal finance tracker inspired by Upwork\'s design system.',
};

/**
 * The root Next.js layout component.
 * Wraps every route in the application, providing global context providers 
 * (like Theme and UserProfile) and establishing baseline HTML scaffolding.
 * 
 * @param {Object} props - The child components rendered within this layout.
 * @param {React.ReactNode} props.children - The specific page content to render.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@8..144,100..1000&display=swap" rel="stylesheet" />
      </head>
      <body
        // Base typography settings and global background color transition smoothing
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
