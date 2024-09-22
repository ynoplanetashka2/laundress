import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
// import localFont from "next/font/local";
import '../globals.css';
import ContextProviders from './ContextProviders';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/authOptions';
import { Box } from '@mui/material';

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: 'laundress',
  icons: '/images/washing_machine.png',
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();
  const session = await getServerSession(authOptions);

  return (
    <html lang={locale}>
      <body
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <AppRouterCacheProvider>
            <ContextProviders session={session}>
              <Box
                sx={{
                  maxWidth: '800px',
                  width: {
                    md: '80vw',
                    sm: '100vw',
                  },
                  margin: '0 auto',
                  minHeight: '100vh',
                }}
                className="bg-cyan-100 px-10 py-3"
              >
                {children}
              </Box>
            </ContextProviders>
          </AppRouterCacheProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
