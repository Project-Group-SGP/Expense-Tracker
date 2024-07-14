import Navbar from "@/components/Navbar"
import { db } from "@/db/db"
import Loading from "./loading"

export default async function Home() {
  return (
    // <Loading />
    <main className="flex flex-col">
      <Navbar />
    </main>
  )
}
