import { cn } from "@/lib/utils"
import Image from "next/image"

export default function Home() {
  const i = true
  return (
    <main
      className={cn(
        "flex min-h-screen items-center justify-center bg-blue-500",
        {
          "bg-green-300": i,
        }
      )}
    >
      Hi
      <img
        src="/SpendWise-1.png"
        alt="Logo"
        className="flex justify-center text-5xl text-red-50"
      />
    </main>
  )
}
