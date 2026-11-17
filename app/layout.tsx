import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brevo SMTP Hub | Next.js Unified Platform",
  description: "Next.js Full-Stack Email Dispatcher & SMTP Test Suite powered by Brevo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

