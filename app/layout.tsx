import type { Metadata } from "next";
import "@/app/globals.css";
import {AppToastProvider} from "@/components/common/AppToastProvider";
import React from "react";

export const metadata: Metadata = {
  title: "Petrodash.io",
  description: "Dashboard de visualización de datos petroleros",
  icons: {
    icon: "/favicon.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <AppToastProvider/>
      </body>
    </html>
  );
}
