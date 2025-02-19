import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat Bot",
  description: "A simple Chat Bot app with no redirects or login checks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar">
      <body>{children}</body>
    </html>
  );
}
