import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Send to Kindle",
  description:
    "Convert articles to EPUBs and send them to your Kindle device.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
