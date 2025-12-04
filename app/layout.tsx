import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

// Primary font - Inter for clean, professional look
const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Monospace font for code/numbers
const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// Comprehensive metadata for SEO
export const metadata: Metadata = {
  title: {
    default: "Meneshaye - Crowdfunding Platform",
    template: "%s | Meneshaye",
  },
  description:
    "Launch your dreams with Meneshaye. The modern crowdfunding platform that connects creators with backers worldwide. Start your campaign today.",
  keywords: [
    "crowdfunding",
    "fundraising",
    "startup funding",
    "creative projects",
    "community funding",
    "campaign",
    "backers",
    "investment",
  ],
  authors: [{ name: "Meneshaye Team" }],
  creator: "Meneshaye",
  publisher: "Meneshaye Inc.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Meneshaye - Crowdfunding Platform",
    description:
      "Launch your dreams with Meneshaye. The modern crowdfunding platform that connects creators with backers worldwide.",
    siteName: "Meneshaye",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Meneshaye - Crowdfunding Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meneshaye - Crowdfunding Platform",
    description:
      "Launch your dreams with Meneshaye. The modern crowdfunding platform that connects creators with backers worldwide.",
    images: ["/og-image.png"],
    creator: "@Meneshaye",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  category: "technology",
};

// Viewport configuration
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to important origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {/* Skip to main content for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground"
            >
              Skip to main content
            </a>

            {/* Main app content */}
            <div
              id="main-content"
              className="relative flex min-h-screen flex-col"
            >
              {children}
            </div>

            {/* Toast notifications */}
            <Toaster
              position="top-right"
              expand={false}
              richColors
              closeButton
            />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
