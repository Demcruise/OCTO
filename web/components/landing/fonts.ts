import { Inter_Tight, Newsreader } from "next/font/google";

/*
 * Landing typography (megaplan §25), loaded only by the landing route.
 * Ondo pairs a geometric grotesk for display with a serif for reading text;
 * OCTO uses Inter Tight (display, 400) and Newsreader (editorial body),
 * plus IBM Plex Mono from the root layout for 10px labels.
 */
export const display = Inter_Tight({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-inter-tight", display: "swap" });
export const serif = Newsreader({ subsets: ["latin"], weight: ["400"], style: ["normal", "italic"], variable: "--font-newsreader", display: "swap" });
