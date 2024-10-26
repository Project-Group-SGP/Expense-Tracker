import RegisterServiceWorker from "@/components/RegisterServiceWorker"
import Navbar from "./dashboard/_components/Navbar"
import { SidebarProvider } from "@/components/Providers/SidebarProvider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider navbar={<Navbar />}>
      {children}
      <RegisterServiceWorker />
    </SidebarProvider>
  )
}
