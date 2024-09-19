import RegisterServiceWorker from "@/components/RegisterServiceWorker"
import Navbar from "./dashboard/_components/Navbar"
import { Analytics } from "@vercel/analytics/react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <Analytics />
      <RegisterServiceWorker />
    </>
  )
}
