import Image from "next/image"

export default function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100 dark:bg-zinc-950">
      <div className="flex flex-col items-center">
        <Image src="/SpendWIse-5.png" width="250" height="250" alt="loading" />
        <p className="mt-4 text-5xl font-bold text-gray-800 dark:text-gray-200">
          Spend<span className="font-bold text-primary">Wise</span>
        </p>
      </div>
    </div>
  )
}
