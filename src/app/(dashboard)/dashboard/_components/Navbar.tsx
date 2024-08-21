import { ModeToggle } from "@/components/ModeToggle"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import MobileNav from "./MobileNav"
import { cn } from "@/lib/utils"
import { logout } from "@/actions/auth/logout"
import { Form } from "@/components/ui/form"

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transaction", label: "Transactions" },
  { href: "/settings", label: "Settings" },
  { href: "/history", label: "History" },
  { href: "/budget", label: "Budget" },
]

const Navbar = () => {
  return (
    <nav className="dark:bg-dark-background/70 dark:border-dark-border fixed start-0 top-0 z-20 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <MobileNav />
          <Link
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src="/SpendWIse-5.png" className="h-9" alt="SpendWise Logo" />
            <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
              spend<span className="text-primary">wise</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden justify-center gap-11 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              className="hover:border-b-2 hover:border-green-600 hover:text-primary"
              href={href}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
          <div className="flex gap-4">
            <div className="hidden md:block lg:block">
              <ModeToggle />
            </div>
            <form action={logout}>
              <Button
                variant="default"
                className={cn(
                  "hidden h-9 rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-700 dark:bg-primary md:flex lg:flex"
                )}
              >
                Logout
                <ArrowRight className="ml-1.5 h-5 w-5" aria-hidden="true" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
