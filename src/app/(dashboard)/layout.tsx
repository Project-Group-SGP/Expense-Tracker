import RegisterServiceWorker from "@/components/RegisterServiceWorker"
import Navbar from "./dashboard/_components/Navbar"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <RegisterServiceWorker />
    </>
  )
}
