import type { Metadata } from "next";
import { Anton, Barlow_Condensed, Pacifico } from "next/font/google";
import "./globals.css";
import GrainOverlay from "@/components/GrainOverlay";

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
  display: "swap",
});

const barlow = Barlow_Condensed({
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
  subsets: ["latin"],
  display: "swap",
});

const pacifico = Pacifico({
  weight: "400",
  variable: "--font-pacifico",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Lodge — SMU BIA",
  description:
    "AI Lodge is a structured 8-week learning programme built around a community with a shared interest in AI. For anyone curious about AI, regardless of technical background.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${barlow.variable} ${pacifico.variable} h-full`}
    >
      <body className="min-h-full">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <GrainOverlay />
      </body>
    </html>
  );
}
