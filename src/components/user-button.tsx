"use client"

import { useRouter } from 'next/navigation';
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { FaUser, FaCog } from "react-icons/fa"; 
import { ExitIcon } from "@radix-ui/react-icons";
import { useCurrentUserClient } from "@/hooks/use-current-user";
import { useTheme } from 'next-themes';
import { logout } from "@/actions/auth/logout"

export const UserButton = () => {
  const user = useCurrentUserClient();
  const router = useRouter(); 
  const { theme } = useTheme();

  const handleSettingsClick = () => {
    router.push('/settings'); 
  };
  console.log("\n\n\n",user,"\n\n\n")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='border-0'>
        <Avatar className={`w-10 h-10 ${theme === 'dark' ? 'bg-black' : 'bg-white' }`}>
          <AvatarImage 
            src={user?.image || ""} 
            className="object-cover"
          />
          <AvatarFallback 
            className={`flex items-center justify-center w-full h-full ${theme === 'dark' ? 'bg-green-500' : 'bg-green-600'} text-white`}
          >
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuItem 
          onClick={handleSettingsClick} 
          className={`flex items-center ${theme === 'dark' ? 'hover:bg-gray-700 text-white' : 'bg-white text-gray-900' } cursor-pointer`}
        >
          <FaCog className={`h-4 w-4 mr-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} /> {/* Settings icon */}
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={`flex items-center ${theme === 'dark' ? 'hover:bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
        >
          <form action={logout}>
            <button className='cursor-pointer'>
              <div className='w-full flex'>
                <ExitIcon className={`h-4 w-4 mr-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
                <p>Logout</p>
              </div>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
