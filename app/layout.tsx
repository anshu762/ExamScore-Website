import type { Metadata } from "next";
import { Spectral } from "next/font/google";
import { Providers } from "@/components/shared/providers";
import LayoutRouter from "@/components/shared/layout-router";
import "./globals.css";

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "ExamScore — Stop Guessing, Start Scoring",
    template: "%s | ExamScore",
  },
  description:
    "Board-specific, examiner-aligned answers for IB, AP, Cambridge, CBSE, and ICSE students. AI-powered study tools for serious exam preparation.",
  keywords: [
    "exam preparation",
    "AI tutoring",
    "IB",
    "AP",
    "Cambridge",
    "CBSE",
    "ICSE",
    "study tools",
    "board-specific answers",
    "examiner-aligned",
  ],
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    title: "ExamScore — Stop Guessing, Start Scoring",
    description:
      "Board-specific, examiner-aligned answers for IB, AP, Cambridge, CBSE, and ICSE students.",
    type: "website",
    siteName: "ExamScore",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spectral.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-bg font-sans text-foreground antialiased">
        <Providers>
          <LayoutRouter>{children}</LayoutRouter>
        </Providers>
      </body>
    </html>
  );
}
