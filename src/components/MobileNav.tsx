"use client"
import React, { useState } from "react"
import Link from "next/link"
import clsx from "clsx"
import { IoClose } from "react-icons/io5"
import { CiMenuFries } from "react-icons/ci"


const navLinks = [
  { href: "/", label: "Home" },
]

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <>
      <CiMenuFries
        className="cursor-pointer text-2xl md:hidden"
        onClick={toggleMenu}
        aria-label="Toggle mobile menu"
      />
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
            {/* <form action={logout}>
              <Button
                variant="link"
                className="text-black dark:text-white hover:text-primary text-base mt-[-10px]"
                size={"lg"}
              >
                Logout
              </Button>
              </form> */}
          </div>
        </section>
      </div>
    </>
  )
}

export default MobileNav
