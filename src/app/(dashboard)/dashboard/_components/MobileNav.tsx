"use client"

import React, { useState } from "react"
import Link from "next/link"
import { IoClose } from "react-icons/io5"
import { CiMenuFries } from "react-icons/ci"
import { Button } from "@/components/ui/button"
import { logout } from "@/actions/auth/logout"
import { motion, AnimatePresence } from "framer-motion"
import { FiHome, FiClock, FiUsers, FiSettings, FiLogOut } from "react-icons/fi"
import { PiggyBank } from "lucide-react"

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: FiHome },
  { href: "/history", label: "History", icon: FiClock },
  { href: "/budget", label: "Budget", icon: PiggyBank },
  { href: "/group", label: "Group", icon: FiUsers },
  { href: "/settings", label: "Settings", icon: FiSettings },
]

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <>
      <CiMenuFries
        className="cursor-pointer text-2xl md:hidden hover:text-primary"
        onClick={toggleMenu}
        aria-label="Toggle mobile menu"
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed left-0 top-0 z-50 h-full w-screen backdrop-blur-sm lg:hidden"
          >
            <motion.section
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute left-0 top-0 h-screen w-56 flex-col gap-8 bg-white p-8 shadow-lg dark:bg-black"
            >
              <IoClose
                onClick={toggleMenu}
                className="mb-8 cursor-pointer text-3xl hover:text-red-600"
                aria-label="Close mobile menu"
              />

              <nav className="flex flex-col items-start justify-center gap-4">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <motion.div
                    key={href}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      className="flex items-center gap-2 hover:text-primary"
                      href={href}
                      onClick={toggleMenu}
                    >
                      <Icon className="text-xl" />
                      <span className="border-b-2 border-transparent hover:border-green-600">
                        {label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}