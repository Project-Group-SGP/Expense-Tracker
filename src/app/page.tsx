import Navbar from "@/components/Navbar"
import { db } from "@/db/db"

export default async function Home() {
  const test = await db.account.findMany()
  console.log(test)
  return (
    <main className="flex flex-col">
      <Navbar />
    </main>
  )
}
