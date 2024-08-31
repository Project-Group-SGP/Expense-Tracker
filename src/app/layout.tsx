import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/Providers/Providers"
import { Toaster } from "@/components/ui/sonner"

const poppins = Poppins({ subsets: ["latin"], weight: "400" })

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Track your expenses with simplicity and effectively",
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
