"use client"

import { useRouter } from "next/navigation"
import { AvatarFallback } from "@radix-ui/react-avatar"
import { Avatar, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { FaUser, FaCog } from "react-icons/fa"
import { ExitIcon } from "@radix-ui/react-icons"
import { useCurrentUserClient } from "@/hooks/use-current-user"
import { useTheme } from "next-themes"
import { logout } from "@/actions/auth/logout"

export const UserButton = () => {
  const user = useCurrentUserClient()
  const router = useRouter()
  const handleSettingsClick = () => {
    router.push("/settings")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-none focus:outline-none">
        <Avatar
          className={`h-10 w-10 border-none bg-white focus:outline-none dark:bg-black`}
        >
          <AvatarImage src={user?.image || ""} className="object-cover" />
          <AvatarFallback
            className={`flex h-full w-full items-center justify-center bg-green-600 text-white`}
          >
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-40 border-none focus:outline-none"
        align="end"
      >
        <DropdownMenuItem
          onClick={handleSettingsClick}
          className={`flex cursor-pointer items-center dark:text-white dark:hover:bg-zinc-800`}
        >
          <FaCog className={`mr-2 h-4 w-4 text-gray-900 dark:text-white`} />{" "}
          {/* Settings icon */}
          Settings
        </DropdownMenuItem>
        {/* <form action={logout}> */}
        <DropdownMenuItem
          className={`"bg-white text-gray-900" flex items-center dark:text-white dark:hover:bg-zinc-800`}
          onClick={() => logout()}
        >
          <button className="cursor-pointer">
            <div className="flex w-full">
              <ExitIcon
                className={`mr-2 h-4 w-4 text-gray-900 dark:text-white`}
              />
              <p>Logout</p>
            </div>
          </button>
        </DropdownMenuItem>
        {/* </form> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
