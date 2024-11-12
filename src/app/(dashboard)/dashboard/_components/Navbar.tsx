// Version-1

// import { ModeToggle } from "@/components/ModeToggle"
// import { Button } from "@/components/ui/button"
// import { ArrowRight } from "lucide-react"
// import Link from "next/link"
// import MobileNav from "./MobileNav"
// import { cn } from "@/lib/utils"
// import { logout } from "@/actions/auth/logout"
// import { UserButton } from "@/components/user-button"
// const navLinks = [
//   { href: "/dashboard", label: "Dashboard" },
//   // { href: "/transaction", label: "Transactions" },
//   // { href: "/settings", label: "Settings" },
//   { href: "/history", label: "History" },
//   { href: "/budget", label: "Budget" },
//   { href: "/group", label: "Group" },
// ]
// const Navbar = () => {
//   return (
//     <nav className="dark:bg-dark-background/70 dark:border-dark-border fixed start-0 top-0 z-20 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl">
//       <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
//         <div className="flex items-center gap-3">
//           <MobileNav />
//           <Link
//             href="/dashboard"
//             className="flex items-center space-x-3 rtl:space-x-reverse"
//           >
//             <img src="/SpendWIse-5.png" className="h-9" alt="SpendWise Logo" />
//             <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
//               spend<span className="text-primary">wise</span>
//             </span>
//           </Link>
//         </div>
//         {/* Desktop Navigation */}
//         <div className="hidden justify-center gap-11 md:flex">
//           {navLinks.map(({ href, label }) => (
//             <Link
//               key={href}
//               className="hover:border-b-2 hover:border-green-600 hover:text-primary"
//               href={href}
//             >
//               {label}
//             </Link>
//           ))}
//         </div>
//         {/* Action Buttons */}
//         <div className="flex space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
//           <div className="flex gap-4">
//             <div className="hidden md:block lg:block">
//               <ModeToggle />
//             </div>
//             <UserButton />
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }
// export default Navbar

// Version-2

// "use client"
// import { useState } from 'react'
// import { ModeToggle } from "@/components/ModeToggle"
// import Link from "next/link"
// import MobileNav from "./MobileNav"
// import { UserButton } from "@/components/user-button"

// const navLinks = [
//   { href: "/dashboard", label: "Dashboard" },
//   { href: "/history", label: "History" },
//   { href: "/budget", label: "Budget" },
//   { href: "/group", label: "Group" },
// ]
// export default function Navbar() {
//   const [isHovering, setIsHovering] = useState(false)
//   return (
//     <nav className="fixed start-0 top-0 z-20 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl dark:border-dark-border dark:bg-dark-background/70">
//       <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
//         <div className="flex items-center gap-3">
//           <MobileNav />
//           <Link
//             href="/dashboard"
//             className="flex items-center space-x-3 rtl:space-x-reverse"
//           >
//             <img src="/SpendWIse-5.png" className="h-9" alt="SpendWise Logo" />
//             <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
//               spend<span className="text-primary">wise</span>
//             </span>
//           </Link>
//         </div>
//         {/* Desktop Navigation */}
//         <div
//           className="hidden justify-center gap-11 md:flex"
//           onMouseLeave={() => setIsHovering(false)}
//         >
//           {navLinks.map(({ href, label }) => (
//             <Link
//               key={href}
//               className={`relative transition-all duration-300 hover:text-primary
//                 ${isHovering ? 'opacity-30 hover:opacity-100' : ''}
//               `}
//               href={href}
//               onMouseEnter={() => setIsHovering(true)}
//             >
//               {label}
//               <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-green-600 transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
//             </Link>
//           ))}
//         </div>
//         {/* Action Buttons */}
//         <div className="flex space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
//           <div className="flex gap-4">
//             <div className="hidden md:block lg:block">
//               <ModeToggle />
//             </div>
//             <UserButton />
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }

// Version-3

"use client"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/ModeToggle"
import Link from "next/link"
import MobileNav from "./MobileNav"
import { UserButton } from "@/components/user-button"
import Image from "next/image"

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/history", label: "History" },
  { href: "/budget", label: "Budget" },
  { href: "/group", label: "Group" },
]

export default function Navbar() {
  const [isHovering, setIsHovering] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="dark:border-dark-border dark:bg-dark-background/70 fixed start-0 top-0 z-20 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <MobileNav />
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <Image
              src="/SpendWIse-5.png"
              width={36}
              height={36}
              alt="SpendWise Logo"
              fetchPriority="high"
              priority
            />
            <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
              spend<span className="text-primary">wise</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div
          className="hidden justify-center gap-11 md:flex"
          onMouseLeave={() => setIsHovering(false)}
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              className={`relative transition-all duration-300 hover:text-primary ${isHovering ? "opacity-30 hover:opacity-100" : ""} ${pathname === href ? "text-primary" : ""} `}
              href={href}
              onMouseEnter={() => setIsHovering(true)}
            >
              {label}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 w-full origin-left transform bg-primary transition-transform duration-300 ${pathname === href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"} `}
              ></span>
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 md:order-2 md:space-x-0 rtl:space-x-reverse">
          <div className="flex gap-4">
            <div className="hidden md:block lg:block">
              <ModeToggle />
            </div>
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  )
}
