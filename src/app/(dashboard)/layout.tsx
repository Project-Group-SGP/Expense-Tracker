import Navbar from "../(dashboard)/dashboard/_components/Navbar"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <html lang="en">
      // <body>
      <>
        <Navbar />
        {children}
      </>
      // </body>
    // </html>
  )
}
