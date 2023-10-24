import { Metadata } from "next";
import { siteConfig } from "~/config/site";
import "~/styles/globals.css";
import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { NextAuthProvider } from "@/components/general/providers/NextAuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/general/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Documentation",
    "Code",
    "API",
    "GraphQL",
    "REST",
    "OpenAPI",
    "Swagger",
    "Postman",
    "Insomnia",
    "APIs",
    "API Documentation",
    "API Docs",
    "API Explorer",
    "API Reference",
    "API Reference Documentation",
    "API Reference Docs",
    "API Reference Explorer",
    "JSDocs",
    "JSDoc",
    "TypeScript",
    "TypeScript Documentation",
    "TypeScript Docs",
    "TypeScript Explorer",
    "TypeScript Reference",
    "TypeScript Reference Documentation",
    "TypeScript Reference Docs",
  ],
  authors: [
    {
      name: "olyvialabs",
      url: "https://olyvialabs.io",
    },
  ],
  creator: "olyvialabs",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.png`],
    creator: `@${siteConfig.username.twitter}`,
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  // icons: {
  //   icon: "/favicons/favicon.ico",
  //   shortcut: "/favicons/favicon-16x16.png",
  //   apple: "/favicons/apple-touch-icon.png",
  // },
  // manifest: `${siteConfig.url}/favicons/site.webmanifest`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`flex min-h-screen flex-col font-sans antialiased ${inter.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider headers={headers()}>
            <NextAuthProvider>{children}</NextAuthProvider>
            <Toaster />
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
