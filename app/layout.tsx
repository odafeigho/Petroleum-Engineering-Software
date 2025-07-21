import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "../lib/i18n/context"
import { AuthProvider } from "../components/auth/auth-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Reservoir Data Harmonizer - Professional Petroleum Engineering Software",
  description:
    "Advanced data harmonization and integration platform for petroleum engineering professionals. Normalize, validate, and integrate multi-format reservoir data with industry-standard algorithms.",
  keywords:
    "petroleum engineering, data harmonization, reservoir data, oil and gas, data integration, normalization, seismic data, production data, well logs",
  authors: [{ name: "Reservoir Data Harmonizer Team" }],
  creator: "Reservoir Data Harmonizer",
  publisher: "Reservoir Data Harmonizer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://reservoir-data-harmonizer.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Reservoir Data Harmonizer - Professional Petroleum Engineering Software",
    description: "Advanced data harmonization and integration platform for petroleum engineering professionals.",
    url: "https://reservoir-data-harmonizer.vercel.app",
    siteName: "Reservoir Data Harmonizer",
    images: [
      {
        url: "/images/petroleum-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Reservoir Data Harmonizer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reservoir Data Harmonizer - Professional Petroleum Engineering Software",
    description: "Advanced data harmonization and integration platform for petroleum engineering professionals.",
    images: ["/images/petroleum-bg.jpg"],
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
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#0ea5e9" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Reservoir Data Harmonizer",
  },
  applicationName: "Reservoir Data Harmonizer",
  category: "productivity",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0f172a" />
        <meta name="msapplication-TileColor" content="#0f172a" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <I18nProvider>
            <AuthProvider>{children}</AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
