import type { Metadata } from "next";
import "@/app/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import {AppToastProvider} from "@/components/common/AppToastProvider";
import React from "react";
import {DashboardShell} from "@/components/layout/DashboardShell";

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
        <DashboardShell>{children}</DashboardShell>
        <AppToastProvider/>
      </body>
    </html>
  );
}
