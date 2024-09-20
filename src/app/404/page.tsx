import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"
import BackButton from "./backButton"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 text-center shadow-lg dark:bg-zinc-900">
        <h1 className="dark:text-primary-400 text-8xl font-extrabold text-primary">
          404
        </h1>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
          Page Not Found
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Oops! It seems you've wandered into uncharted financial territory.
          Let's get you back on track with your expenses.
        </p>
        <blockquote className="dark:border-primary-400 rounded-r-lg border-l-4 border-primary bg-gray-50 py-3 pl-4 italic text-gray-700 dark:bg-zinc-800 dark:text-gray-300">
          "Saving money is wise, but finding a missing page is a valuable
          lesson."
        </blockquote>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <BackButton className="w-full" />
          <Link href="/" className="w-full">
            <Button className="dark:bg-primary-400 dark:hover:bg-primary-400/90 w-full bg-primary text-white hover:bg-primary/90 dark:text-zinc-950">
              <Home className="mr-2 h-4 w-4" /> Back to SpendWise
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
