import type { Metadata } from "next";
import { AppFrame } from "@/components/shell/app-frame";

export const metadata: Metadata = {
  title: { default: "Control Center · OCTO", template: "%s · OCTO" },
  robots: { index: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppFrame>{children}</AppFrame>;
}
