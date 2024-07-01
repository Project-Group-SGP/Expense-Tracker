import Link from "next/link"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { Button, buttonVariants } from "./ui/button"
import { ArrowRight } from "lucide-react"
import { ModeToggle } from "./ModeToggle"

const Navbar = async () => {
  return (
    <nav className="fixed start-0 top-0 z-20 w-full border-b border-border/40 bg-background backdrop-blur-lg transition-all">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img src="/SpendWise-5.png" className="h-9" alt="SpendWise Logo" />
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            spend<span className="text-primary">wise</span>
          </span>
        </Link>
        <div className="flex space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
          <div className="flex gap-4">
            <div className="hidden md:block lg:block">
              <ModeToggle />
            </div>
            <Button variant={"ghost"}>
              <Link href="#">Login</Link>
            </Button>
            <Button
              variant={"default"}
              className="flex h-9 rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-700"
            >
              Signup
              <ArrowRight className="ml-1.5 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
