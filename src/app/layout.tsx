import type { Metadata } from "next";
import { Anton, Barlow_Condensed, Pacifico } from "next/font/google";
import "./globals.css";
import GrainOverlay from "@/components/layout/GrainOverlay";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const barlow = Barlow_Condensed({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow",
  display: "swap",
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ailodge.smubia.org"),
  title: {
    default: "AI Lodge — SMU BIA",
    template: "%s · AI Lodge",
  },
  description:
    "AI Lodge is an 8-week AI/ML learning programme under SMU BIA — small lodges, peer learning, and real projects. Built for anyone curious about AI, regardless of background.",
  openGraph: {
    title: "AI Lodge — SMU BIA",
    description:
      "An 8-week AI/ML learning programme. Small lodges, peer learning, real projects. Be part of the pioneer batch.",
    images: ["/og.jpg"],
    type: "website",
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${barlow.variable} ${pacifico.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Runs before first paint: if the splash will play this session, hide the
            landing immediately so it never flashes behind the entry. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if(!sessionStorage.getItem('ail-splash-seen')&&location.search.indexOf('nosplash')===-1)document.documentElement.setAttribute('data-splash','1')}catch(e){}})()",
          }}
        />
      </head>
      <body className="min-h-full" suppressHydrationWarning>
        {children}
        <GrainOverlay />
      </body>
    </html>
  );
}
