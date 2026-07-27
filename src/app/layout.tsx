import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "@/components/SessionProvider";
import { AuthButton } from "@/components/AuthButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CHRA Classifier - Chemical Hazard Classification",
  description:
    "Classify chemical mixtures based on Malaysian ICOP guidelines (GHS). Health hazard classification using additivity formula and concentration limits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <header className="border-b bg-white dark:bg-gray-950">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight">
                  CHRA Classifier
                </span>
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Free
                </span>
              </div>
              <nav className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground hidden sm:inline">
                  Health Hazards Only
                </span>
                <AuthButton />
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t bg-gray-50 dark:bg-gray-950">
            <div className="mx-auto max-w-5xl px-4 py-4 text-center text-xs text-muted-foreground">
              <p>
                Based on ICOP on Classification, Labelling and Safety Data Sheet
                of Hazardous Chemicals 2014 & Amendment 2019 (DOSH Malaysia)
              </p>
              <p className="mt-1">
                For guidance only. Not a substitute for professional assessment.
              </p>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
