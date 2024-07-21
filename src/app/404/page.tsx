import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-3 dark:bg-gray-900 md:px-0 lg:px-0">
      <div className="space-y-6 rounded-lg bg-white p-8 text-center shadow-md dark:bg-gray-800">
        <h1 className="dark:text-primary-400 text-6xl font-bold text-primary">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Page Not Found
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Oops! It seems you've wandered into uncharted financial territory.
          <br />
          Let's get you back on track with your expenses.
        </p>
        <blockquote className="border-l-4 border-primary py-2 pl-4 italic text-gray-700 dark:text-gray-300">
          "Saving money is wise, but finding a missing page is a valuable
          lesson."
        </blockquote>
        <Link href="/">
          <Button className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to SpendWise
          </Button>
        </Link>
      </div>
    </div>
  )
}
