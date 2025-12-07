import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { AuthProvider } from '@/contexts/auth';
import { ConversationProvider } from '@/contexts/conversation';
import { ReactQueryProvider } from '@/lib/react-query';
import { Toaster } from '@/components/ui/sonner';
import ChatFloatingButton from '@/components/chat/ChatFloatingButton';
import NavigationLoader from '@/components/loading/NavigationLoader';

// Gilroy font family configuration
const gilroy = localFont({
  src: [
    {
      path: '../fonts/SVN-Gilroy-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/SVN-Gilroy-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/SVN-Gilroy-SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../fonts/SVN-Gilroy-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-gilroy',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VHealth',
  description:
    'A comprehensive health management platform for tracking and monitoring your health journey',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${gilroy.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {/*
          suppressHydrationWarning is used to prevent hydration mismatch errors caused by
          browser extensions (like BIS, ad-blockers, etc.) that inject attributes into the body element.
          This is safe to use here as we're only applying CSS classes and the hydration mismatch
          is caused by external factors, not application state.
        */}
        <ReactQueryProvider>
          <AuthProvider>
            <ConversationProvider>
              <NavigationLoader />
              {children}
            </ConversationProvider>
          </AuthProvider>
          <Toaster />
          <ChatFloatingButton />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
