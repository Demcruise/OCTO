import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const title = "OCTO — Private Markets Investment Intelligence Infrastructure";
const description =
  "OCTO connects investment data, ontology, intelligence, analytics, and governed workflows into one operational system for private markets.";

export const metadata: Metadata = {
  metadataBase: new URL("https://octo.mesta.click"),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description, type: "website", siteName: "OCTO", url: "/" },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable}`}>
      <body className="bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-white">
        {children}
      </body>
    </html>
  );
}
