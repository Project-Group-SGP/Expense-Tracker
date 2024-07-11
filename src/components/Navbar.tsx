"use client"
import Link from "next/link"
import { Button } from "./ui/button"
import { ArrowRight } from "lucide-react"
import { ModeToggle } from "./ModeToggle"
import { CiMenuFries } from "react-icons/ci"
import { IoClose } from "react-icons/io5"
import { useState } from "react"
import clsx from "clsx"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="dark:bg-dark-background dark:border-dark-border fixed start-0 top-0 z-20 w-full border-b border-border/40 bg-background backdrop-blur-lg transition-all">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <CiMenuFries
            className="cursor-pointer text-2xl md:hidden"
            onClick={() => setIsOpen(true)}
          />

          {/* navbar logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src="/SpendWise-5.png" className="h-9" alt="SpendWise Logo" />
            <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
              spend<span className="text-primary">wise</span>
            </span>
          </Link>

          {/* sidebar for mobile */}
          <div
            className={clsx(
              "fixed left-0 top-0 z-50 h-full w-screen backdrop-blur-sm transition-all lg:hidden",
              isOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <section className="absolute left-0 top-0 h-screen w-56 flex-col gap-8 bg-white p-8 shadow-lg dark:bg-black">
              <IoClose
                className="mb-8 cursor-pointer text-3xl"
                onClick={() => setIsOpen(false)}
              />
              <div className="flex flex-col items-center justify-center gap-4">
                <Link
                  className="hover:border-b-2 hover:border-green-600 hover:text-primary"
                  href="/"
                >
                  home
                </Link>
                <Link
                  className="hover:border-b-2 hover:border-green-600 hover:text-primary"
                  href="/spend"
                >
                  spend
                </Link>
                <Link
                  className="hover:border-b-2 hover:border-green-600 hover:text-primary"
                  href="/about"
                >
                  about
                </Link>
                <Link
                  className="hover:border-b-2 hover:border-green-600 hover:text-primary"
                  href="/contact"
                >
                  contact
                </Link>
              </div>
            </section>
          </div>
        </div>

        {/* navbar menu */}
        <div className="hidden justify-center gap-11 md:flex">
          <ul>
            <Link
              className="hover:border-b-2 hover:border-green-600 hover:text-primary"
              href="/"
            >
              home
            </Link>
          </ul>
          <ul>
            <Link
              className="hover:border-b-2 hover:border-green-600 hover:text-primary"
              href="/spend"
            >
              spend
            </Link>
          </ul>
          <ul>
            <Link
              className="hover:border-b-2 hover:border-green-600 hover:text-primary"
              href="/about"
            >
              about
            </Link>
          </ul>
          <ul>
            <Link
              className="hover:border-b-2 hover:border-green-600 hover:text-primary"
              href="/contact"
            >
              contact
            </Link>
          </ul>
        </div>

        {/* navbar button */}
        <div className="flex space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
          <div className="flex">
            <div className="hidden md:block lg:block">
              <ModeToggle />
            </div>
            <Button variant={"ghost"}>
              {/* <Link href="/signin">Login</Link> */}
            </Button>
            <Button
              variant={"default"}
              className="flex h-9 rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-700"
            >
              <Link href="/signin"> Get Started </Link>
              <ArrowRight className="ml-1.5 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
