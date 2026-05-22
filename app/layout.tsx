import type { Metadata } from "next";
import { Spectral } from "next/font/google";
import { Providers } from "@/components/shared/providers";
import "./globals.css";

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "ExamScore | Premium AI-Powered Exam Preparation",
    template: "%s | ExamScore",
  },
  description:
    "Master your exams with AI-powered study tools. Get board-specific answers, structured guides, and personalized learning strategies.",
  keywords: [
    "exam preparation",
    "AI tutoring",
    "IB",
    "AP",
    "Cambridge",
    "CBSE",
    "ICSE",
    "study tools",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spectral.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-bg font-sans text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
