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

const title = "OCTO — The Operating System for Private Markets";
const description =
  "OCTO connects investment data, portfolio intelligence, workflow, analytics, and reporting in one governed system for private markets.";

export const metadata: Metadata = {
  metadataBase: new URL("https://octo.mesta.click"),
  title,
  description,
  openGraph: { title, description, type: "website", siteName: "OCTO" },
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
