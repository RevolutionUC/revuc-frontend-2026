import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import { ThemeProvider } from "@/app/components/theme-provider";
import ScrollSmootherWrapper from "@/app/components/ScrollSmoother";
import "./globals.css";
import { NavigationBar } from "@/app/components/NavigationBar";

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
  title: "RevolutionUC 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Create an array of 8 items to map over
  const bgParts = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${instrumentSans.className} ${ibmPlexMono.variable} antialiased`}>
        <NavigationBar />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ScrollSmootherWrapper>
            <div className="relative flex min-h-screen flex-col">
              
              {/* --- BACKGROUND CONTAINER START --- */}
              <div className="absolute top-0 left-0 w-full z-0 pointer-events-none select-none">
                {bgParts.map((num) => (
                  <img
                    key={num}
                    src={`/bg-part-${num}.webp`} // Assumes files are named bg-part-1.webp, etc.
                    alt=""
                    // The first image loads eagerly (fast), the rest lazy load as you scroll
                    loading={num === 1 ? "eager" : "lazy"}
                    // 'block' removes the tiny white gap that appears between stacked images
                    className="w-full h-auto block" 
                  />
                ))}
              </div>
              {/* --- BACKGROUND CONTAINER END --- */}

              <main className="flex-1 relative z-10">{children}</main>
            </div>
          </ScrollSmootherWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}