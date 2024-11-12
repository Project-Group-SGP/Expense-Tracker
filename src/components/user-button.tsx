"use client"

import { logout } from "@/actions/auth/logout"
import { useCurrentUserClient } from "@/hooks/use-current-user"
import { AvatarFallback } from "@radix-ui/react-avatar"
import { LogOut, Monitor, Moon, Settings, Sun } from "lucide-react"
import { useRouter } from "next/navigation"
import { FaUser } from "react-icons/fa"
import { Avatar, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { useTheme } from "next-themes"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]

export const UserButton = () => {
  const user = useCurrentUserClient()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="group relative h-10 w-10 rounded-full p-0 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Open user menu"
        >
          <Avatar className="h-10 w-10 border-2 border-transparent bg-background transition-all duration-200 group-hover:border-primary/20 group-hover:shadow-md dark:bg-black">
            <AvatarImage src={user?.image || ""} className="object-cover" />
            <AvatarFallback className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
              <FaUser className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end" sideOffset={5}>
        <DropdownMenuLabel className="px-2 pt-2">
          <div className="flex flex-col gap-1">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="md:hidden" />
        <div className="p-1 md:hidden">
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
          onClick={() => router.push("/settings")}
          className="cursor-pointer gap-2 p-2 transition-colors duration-200 hover:text-primary focus:text-primary"
        >
          <Settings className="h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => logout()}
          className="cursor-pointer gap-2 p-2 text-destructive transition-colors duration-200 hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
