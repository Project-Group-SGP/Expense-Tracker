"use client"

import { logout } from "@/actions/auth/logout"
import { useSidebar } from "@/components/Providers/SidebarProvider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCurrentUserClient } from "@/hooks/use-current-user"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import {
  Menu,
  Moon,
  Sun,
  LogOut,
  PanelRightClose,
  PanelRightOpen,
  ChevronsUpDown,
  Laptop,
  Monitor,
  UserCircle,
  Settings,
} from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { FiClock, FiHome, FiSettings, FiUsers } from "react-icons/fi"
import { TbReportAnalytics } from "react-icons/tb"
import { PiggyBank } from "lucide-react"
import { CiMenuFries } from "react-icons/ci"
import { FaUser } from "react-icons/fa"
import Image from "next/image"

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: FiHome },
  { href: "/history", label: "History", icon: FiClock },
  { href: "/budget", label: "Budget", icon: PiggyBank },
  { href: "/report", label: "Report", icon: TbReportAnalytics },
  { href: "/group", label: "Group", icon: FiUsers },
  { href: "/settings", label: "Settings", icon: FiSettings },
]

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]

export default function Component() {
  const { isSidebarOpen, toggleSidebar } = useSidebar()
  const user = useCurrentUserClient()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const handleLogout = async () => {
    await logout()
    toggleSidebar()
  }

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-primary"
        onClick={toggleSidebar}
      >
        <CiMenuFries className="h-6 w-6" />
        <span className="sr-only">Toggle mobile menu</span>
      </Button>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 backdrop-blur-sm"
              onClick={toggleSidebar}
            />

            {/* Sidebar */}
            <motion.section
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute left-0 top-0 z-50 flex h-screen w-64 flex-col border-r bg-background"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Floating Close Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.2 }}
                className="absolute -right-4 top-4 z-50"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-none text-muted-foreground hover:bg-accent hover:text-foreground"
                  onClick={toggleSidebar}
                >
                  <PanelRightOpen className="h-6 w-6" />
                </Button>
              </motion.div>

              {/* Header */}
              <div className="flex items-center space-x-2 border-b p-6">
                <Image
                  src={`/SpendWIse-5.png`}
                  alt="SpendWise Logo"
                  className="flex-shrink-0"
                  height={40}
                  width={40}
                  fetchPriority="high"
                  priority
                />
                <span className="truncate text-2xl font-bold tracking-tight">
                  <span className="text-foreground">spend</span>
                  <span className="text-primary">wise</span>
                </span>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-2 p-4">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={toggleSidebar}
                    className={cn(
                      "flex items-center gap-4 rounded-lg px-3 py-2 text-base font-medium transition-all duration-300",
                      pathname.startsWith(href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon className="flex-shrink-0 text-xl" />
                    <span className="truncate tracking-wide">{label}</span>
                  </Link>
                ))}
              </nav>

              {/* User Profile and Theme Toggle */}
              <div className="border-t p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-auto w-full p-0 hover:bg-transparent"
                    >
                      <div className="group flex w-full items-center gap-3 rounded-lg p-3">
                        <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-transparent transition-all group-hover:ring-primary/20">
                          <AvatarImage
                            src={user?.image || ""}
                            className="object-cover"
                          />
                          <AvatarFallback className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                            <FaUser className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-1 flex-col items-start">
                          <span className="w-full truncate text-sm font-semibold transition-colors group-hover:text-primary">
                            {user?.name}
                          </span>
                          <span className="w-full truncate text-xs text-muted-foreground">
                            {user?.email}
                          </span>
                        </div>
                        <ChevronsUpDown className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48"
                    sideOffset={8}
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <div className="p-1">
                      <div className="flex items-center gap-1 rounded-lg bg-accent/50 p-1">
                        {themeOptions.map((option) => {
                          const Icon = option.icon
                          return (
                            <Button
                              key={option.value}
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "h-7 flex-1 px-2 transition-all duration-200 hover:text-primary",
                                theme === option.value &&
                                  "bg-background text-primary shadow-sm"
                              )}
                              onClick={() => setTheme(option.value)}
                            >
                              <Icon className="h-4 w-4" />
                              <span className="sr-only">{option.label}</span>
                            </Button>
                          )
                        })}
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
