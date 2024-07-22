import { FacebookRedirectCleaner } from "@/components/FacebookRedirectCleaner"
import Navbar from "./dashboard/_components/Navbar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <FacebookRedirectCleaner />
      <Navbar />
      {children}
    </>
  )
}
