import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Werner Electric — Control that endures every shift.",
  description:
    "Werner Electric — specialists in push buttons, switches, relays and signaling devices for industry. Engineered in India and Turkey.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700,800,900&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
