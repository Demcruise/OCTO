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

const title = "OCTO — Private Markets Infrastructure";
const description =
  "OCTO connects investment data, ontology, intelligence, workflow, and governance in one system for private markets.";
const ogTitle = "OCTO — One System for Every Investment Decision";

export const metadata: Metadata = {
  metadataBase: new URL("https://octo.mesta.click"),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { title: ogTitle, description, type: "website", siteName: "OCTO", url: "/" },
  twitter: { card: "summary_large_image", title: ogTitle, description },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable}`}>
      <body className="bg-white text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
