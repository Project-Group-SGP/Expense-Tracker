import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/Providers/Providers"
import { Toaster } from "@/components/ui/sonner"

const poppins = Poppins({ subsets: ["latin"], weight: "400" })

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
  ],
  authors: [{ name: "Ayush Kalathiya, Dhruv Kotadiya, Sarthak Mayani" }],
  creator: "Ayush Kalathiya, Dhruv Kotadiya, Sarthak Mayani",
  openGraph: {
    type: "website",
    url: process.env.BASE_URL,
    title: "Spendwise - Expense Tracker",
    description:
      "Easily log and categorize your expenses, set budgets, and track your spending habits.",
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
      "Easily log and categorize your expenses, set budgets, and track your spending habits.",
    images: ["/og_image.png"],
  },
  alternates: {
    canonical: process.env.BASE_URL,
    languages: {
      "en-US": "/en-US",
      "es-ES": "/es-ES",
    },
  },
  category: "Finance",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Providers>
          {children}
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  )
}
