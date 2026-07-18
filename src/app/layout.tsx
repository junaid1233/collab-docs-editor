import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Raxha — Collaborative Document Editor",
  description:
    "Write together with Word-style formatting, auto-save, and simple email sharing. Built by Muhammad Junaid.",
  openGraph: {
    title: "Raxha — Collaborative Document Editor",
    description:
      "Write together with Word-style formatting, auto-save, and simple email sharing.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raxha — Collaborative Document Editor",
    description:
      "Write together with Word-style formatting, auto-save, and simple email sharing.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
