import Navbar from "@/components/Navbar"
import { db } from "@/db/db"

export default async function Home() {
  return (
    <main className="flex flex-col">
      <Navbar />
    </main>
  )
}
