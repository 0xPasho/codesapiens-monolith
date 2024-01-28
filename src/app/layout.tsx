import { Metadata } from "next";
import { siteConfig } from "~/config/site";
import "~/styles/globals.css";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { GoogleAnalytics } from "nextjs-google-analytics";

import { TRPCReactProvider } from "~/trpc/react";
import { NextAuthProvider } from "@/components/general/providers/NextAuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/general/theme-provider";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name} - Elevate Your Coding Experience`,
  },
  description: `${siteConfig.name} offers an AI-driven solution for understanding and documenting code in any language, seamlessly integrating with GitHub for improved team collaboration and workflow efficiency.`,
  keywords: [
    `${siteConfig.name}`,
    "AI-Powered Code Documentation",
    "GitHub Integration",
    "Automated Code Documentation",
    "Codebase Query",
    "Dynamic Documentation",
    "Programming Language Support",
    "Team Collaboration Tools",
    "GitHub Repository Analysis",
    "Code Management",
    "AI Coding Assistant",
    "Interactive Code Visualizations",
    "JavaScript Style Guide",
    "Jupyter Notebooks for Software",
    "Interactive Data Visualization",
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
    "Automated Documentation",
    "API Design",
    "API Testing",
    "API Versioning",
    "API Tools",
    "API Integration",
    "API Management",
    "API Development",
    "Code Examples",
    "API Guides",
    "API Best Practices",
    "API Security",
    "API Schema",
    "API Blueprint",
    "API Endpoints",
    "API Models",
    "API Authentication",
    "API Libraries",
    "RESTful Services",
    "GraphQL Queries",
    "GraphQL Schema",
    "OpenAPI Specification",
    "Swagger Editor",
    "Swagger UI",
    "Postman Collections",
    "Insomnia REST Client",
    "API Mocking",
    "API Monitoring",
    "Interactive API Docs",
    "SDK Documentation",
    "API Testing Tools",
    "TypeScript Typings",
    "TypeScript Compiler",
    "TypeScript Linting",
    "TypeScript API",
    "TypeScript Patterns",
    "TypeScript Modules",
    "JSDoc Annotations",
    "JSDoc Tags",
    "JSDoc Templates",
  ],
  authors: [
    {
      name: "olyvialabs",
      url: "https://olyvialabs.io",
    },
    { name: "pasho", url: "https://pasho.io" },
    { name: "brandon aguilar", url: "https://pasho.io" },
  ],
  creator: "olyvialabs",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.name} - AI-Powered Coding Assistant`,
    description: `Streamline your coding workflow with ${siteConfig.name}, an AI assistant for code understanding and dynamic documentation. Perfect for teams and developers of all levels.`,
    siteName: `${siteConfig.name}`,
    images: [`${siteConfig.url}/logo.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - Revolutionize Your Coding Workflow`,
    description: `Discover how ${siteConfig.name} can transform your coding process with AI-powered documentation and query capabilities, all integrated within GitHub.`,
    images: [`${siteConfig.url}/logo.png`],
    creator: `@${siteConfig.username.twitter}`,
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  manifest: `${siteConfig.url}/manifest.json`,
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
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`flex min-h-screen flex-col font-sans antialiased ${inter.variable}`}
      >
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-HEHDQ0XV9V" />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-HEHDQ0XV9V');
        `}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" /*"system" enableSystem*/
        >
          <TRPCReactProvider headers={headers()}>
            <NextAuthProvider>{children}</NextAuthProvider>
            <Toaster />
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
