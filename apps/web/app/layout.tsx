import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PawBase ERP",
  description: "Mobile-first ERP for kennel and pet boarding businesses"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
