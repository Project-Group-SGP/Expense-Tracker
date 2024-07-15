"use client"
import { ModeToggle } from "@/components/ModeToggle"
import { Button } from "@/components/ui/button"
import clsx from "clsx"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { CiMenuFries } from "react-icons/ci"
import { IoClose } from "react-icons/io5"

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transaction", label: "Transaction" },
  { href: "/", label: "About" },
  { href: "/", label: "Contact" },
]

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="dark:bg-dark-background dark:border-dark-border fixed start-0 top-0 z-20 w-full border-b border-border/40 bg-background backdrop-blur-lg transition-all">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <CiMenuFries
            className="cursor-pointer text-2xl md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle mobile menu"
          />

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

        {/* Mobile Navigation Sidebar */}
        <div
          className={clsx(
            "fixed left-0 top-0 z-50 h-full w-screen backdrop-blur-sm transition-all lg:hidden",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <section className="absolute left-0 top-0 h-screen w-56 flex-col gap-8 bg-white p-8 shadow-lg dark:bg-black">
            <IoClose
              onClick={toggleMenu}
              className="mb-8 cursor-pointer text-3xl"
              aria-label="Close mobile menu"
            />
            <div className="flex flex-col items-center justify-center gap-4">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  className="hover:border-b-2 hover:border-green-600 hover:text-primary"
                  href={href}
                  onClick={toggleMenu}
                >
                  {label}
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
          <div className="flex gap-4">
            <div className="hidden md:block lg:block">
              <ModeToggle />
            </div>
            <Button
              variant={"default"}
              className="flex h-9 rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-700 dark:bg-primary"
            >
              <Link href="/">Logout</Link>
              <ArrowRight className="ml-1.5 h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
