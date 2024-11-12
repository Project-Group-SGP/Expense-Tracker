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
import { Menu, Moon, Sun, LogOut, PanelRightClose, PanelRightOpen, ChevronsUpDown, Laptop, Monitor, UserCircle, Settings } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { FiClock, FiHome, FiSettings, FiUsers } from "react-icons/fi"
import { TbReportAnalytics } from "react-icons/tb"
import { PiggyBank } from "lucide-react"
import { CiMenuFries } from "react-icons/ci"

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: FiHome },
  { href: "/history", label: "History", icon: FiClock },
  { href: "/budget", label: "Budget", icon: PiggyBank },
  { href: "/report", label: "Report", icon: TbReportAnalytics },
  { href: "/group", label: "Group", icon: FiUsers },
  { href: "/settings", label: "Settings", icon: FiSettings },
]

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor }
]

export default function Component() {
  const { isSidebarOpen, toggleSidebar } = useSidebar()
  const user = useCurrentUserClient()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

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
              className="absolute left-0 top-0 z-50 flex h-screen w-64 flex-col bg-background border-r"
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
              <div className="flex items-center space-x-4 border-b p-6">
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/SpendWIse-5.png`}
                  alt="SpendWise Logo"
                  className="h-10 w-10 flex-shrink-0"
                />
                <span className="text-2xl font-bold tracking-tight truncate">
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
                      pathname === href 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon className="text-xl flex-shrink-0" />
                    <span className="tracking-wide truncate">{label}</span>
                  </Link>
                ))}
              </nav>

              {/* User Profile and Theme Toggle */}
              <div className="border-t p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full p-0 h-auto hover:bg-transparent"
                    >
                      <div className="flex w-full items-center gap-3 rounded-lg p-3 group">
                        <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                          <AvatarImage src={user?.image || ""} className="object-cover" />
                          <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-1 flex-col items-start">
                          <span className="text-sm font-semibold truncate w-full group-hover:text-primary transition-colors">
                            {user?.name}
                          </span>
                          <span className="text-xs text-muted-foreground truncate w-full">
                            {user?.email}
                          </span>
                        </div>
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
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
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <div className="p-1">
                      <div className="flex items-center gap-1 rounded-lg bg-accent p-1">
                        {themeOptions.map((option) => {
                          const Icon = option.icon
                          return (
                            <Button
                              key={option.value}
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "flex-1 h-7 px-2",
                                theme === option.value && "bg-background shadow-sm"
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
                      className="text-destructive focus:text-destructive focus:bg-destructive/10"
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