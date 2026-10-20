import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "START",
  description: "The START site for brands.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
