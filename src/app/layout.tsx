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
    "Spendwise: Your go-to expense tracker for smart financial management. Easily log expenses, set budgets, and analyze your spending habits for better financial control.",
  manifest: "/manifest.json",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Spendwise",
    "expense tracker",
    "budget planner",
    "finance management",
    "personal finance",
    "spending analysis",
    "money management app",
  ],
  authors: [
    { name: "Spendwise Team: Ayush Kalathiya, Dhruv Kotadiya, Sarthak Mayani" },
  ],
  creator: "Spendwise Team",
  openGraph: {
    type: "website",
    url: process.env.BASE_URL,
    title: "Spendwise - Expense Tracker",
    description:
      "Spendwise helps you effortlessly log and categorize expenses, set personalized budgets, and track spending habits for improved financial health.",
    siteName: "Spendwise",
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
      "Take control of your finances with Spendwise. Log expenses, set budgets, and analyze spending patterns effortlessly.",
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
        <link rel="canonical" href={process.env.BASE_URL} />
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
          name: "Spendwise",
          url: process.env.BASE_URL,
          description:
            "Spendwise is your smart expense tracker for effortless financial management. Log expenses, set budgets, and analyze spending habits to take control of your finances.",
          applicationCategory: "FinanceApplication",
          creator: {
            "@type": "Organization",
            name: "Spendwise Team",
            member: [
              {
                "@type": "Person",
                name: "Ayush Kalathiya",
              },
              {
                "@type": "Person",
                name: "Dhruv Kotadiya",
              },
              {
                "@type": "Person",
                name: "Sarthak Mayani",
              },
            ],
          },
          publisher: {
            "@type": "Person",
            name: "Ayush Kalathiya, Dhruv Kotadiya, Sarthak Mayani",
          },
          featureList: [
            "Expense tracking",
            "Budget planning",
            "Spending analysis",
            "Financial insights",
            "Personalized expenses",
            "Group expenses",
          ],
        })}
      </Script>
    </html>
  )
}
