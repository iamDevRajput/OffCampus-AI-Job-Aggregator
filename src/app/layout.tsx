import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OffCampus AI - Personal Job Aggregator & Match Engine",
  description: "Automated real-time job discovery for tech freshers, college graduates, and early career engineers with AI profile matching and priority dream company tracking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background min-h-screen text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
