import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kelp Restoration Model",
  description:
    "Interactive map for modeling kelp forest restoration along the California coast",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          crossOrigin=""
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
