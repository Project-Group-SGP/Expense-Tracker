"use client"

import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

const expenseQuotes = [
  "A penny saved is a penny earned.",
  "Beware of little expenses. A small leak will sink a great ship.",
  "Don't tell me what you value, show me your budget, and I'll tell you what you value.",
  "The art is not in making money, but in keeping it.",
  "It's not your salary that makes you rich, it's your spending habits.",
]

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const randomQuote =
    expenseQuotes[Math.floor(Math.random() * expenseQuotes.length)]

  return (
    <MaxWidthWrapper>
      <section className="flex min-h-screen items-center justify-center px-3 md:px-0">
        <div className="flex flex-col items-center justify-between gap-12 md:flex-row">
          <div className="w-full max-w-xl md:max-w-none md:flex-1 md:text-left">
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Oops! Something Went Wrong
            </h1>
            <p className="mt-6 text-lg text-destructive sm:text-xl">
              {error.message}
            </p>
            <div className="mt-4 text-base italic text-gray-700 dark:text-gray-400 sm:text-lg">
              "{randomQuote}"
            </div>
            <Button
              onClick={reset}
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-green-600 p-5 text-lg font-medium text-white transition-colors"
            >
              Try Again
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Button>
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              If the problem persists, please contact us at{" "}
              <a
                href="mailto:etracker690@gmail.com"
                className="text-blue-500 hover:underline"
              >
                etracker690@gmail.com
              </a>{" "}
              and attach a copy of this page.
            </p>
          </div>
          <div className="hidden w-full max-w-md lg:block">
            <Image
              src="/Piggy_Bank.svg"
              width={500}
              height={500}
              alt="Error illustration"
              className="object-contain"
            />
          </div>
        </div>
      </section>
    </MaxWidthWrapper>
  )
}
