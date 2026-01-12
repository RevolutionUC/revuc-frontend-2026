import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import { ThemeProvider } from "./components/theme-provider";
import ScrollSmootherWrapper from "./components/ScrollSmoother";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "RevolutionUC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/website-background.webp" as="image" />
      </head>
      <body
        className={`${instrumentSans.className} ${ibmPlexMono.variable} antialiased`}
        style={{
          backgroundColor: '#f0f0f0',
          backgroundImage: 'url(/website-background.webp)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          // backgroundPosition: 'center',
          // backgroundAttachment: 'fixed',
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ScrollSmootherWrapper>
            <div className="relative flex min-h-screen flex-col">
              <main className="flex-1">{children}</main>
            </div>
          </ScrollSmootherWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
