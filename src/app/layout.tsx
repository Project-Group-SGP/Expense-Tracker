import type { Metadata, Viewport } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/Providers/Providers"
import { Toaster } from "@/components/ui/sonner"
import Script from "next/script"
// import { GoogleAnalytics } from "@next/third-parties/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const poppins = Poppins({ subsets: ["latin"], weight: "400" })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: "Spendwise - Expense Tracker",
  description:
    "Track your expenses with simplicity and effectiveness. Spendwise helps you log expenses, set budgets, and analyze your spending habits.",
  manifest: "/manifest.json",
  referrer: "origin-when-cross-origin",
  keywords: [
    "expense tracker",
    "budget planner",
    "finance management",
    "personal finance",
    "spending analysis",
    "spendwise",
  ],
  authors: [{ name: "Ayush Kalathiya, Dhruv Kotadiya, Sarthak Mayani" }],
  creator: "Ayush Kalathiya, Dhruv Kotadiya, Sarthak Mayani",
  openGraph: {
    type: "website",
    url: process.env.BASE_URL,
    title: "Spendwise - Expense Tracker",
    description:
      "Easily log and categorize your expenses, set budgets, and track your spending habits with spendwise.",
    siteName: "Spendwise - Expense Tracker",
    images: [
      {
        url: "/og_image.png",
        width: 1200,
        height: 630,
        alt: "Spendwise Expense Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spendwise - Expense Tracker",
    description:
      "Easily log and categorize your expenses, set budgets, and track your spending habits with spendwise.",
    images: ["/og_image.png"],
  },
  category: "Finance",
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="https://trackwithspendwise.vercel.app/favicon.ico"
          type="image/x-icon"
        />
      </head>
      <body className={poppins.className}>
        <Providers>
          {children}
          <Toaster richColors />
          {/* <GoogleAnalytics gaId="G-D5HK4RNZKV" /> */}
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
      <Script type="application/ld+json" id="schema">
        {JSON.stringify({
          "@context": "http://schema.org",
          "@type": "WebSite",
          name: "Spendwise - Expense Tracker",
          url: process.env.BASE_URL,
          description:
            "Track your expenses with simplicity and effectiveness. Spendwise helps you log expenses, set budgets, and analyze your spending habits.",
          creator: {
            "@type": "Person",
            name: "Ayush Kalathiya, Dhruv Kotadiya, Sarthak Mayani",
          },
          publisher: {
            "@type": "Person",
            name: "Ayush Kalathiya, Dhruv Kotadiya, Sarthak Mayani",
          },
        })}
      </Script>
    </html>
  )
}
