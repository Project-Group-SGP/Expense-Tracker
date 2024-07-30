import React from "react";

import { Toaster } from "@/components/ui/sonner";

const ProtectedLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className="h-screen flex-col items-center content-center text-center justify-center justify-items-center gap-y-10 ">
      <div className="w-full mt-10 flex ">
        <nav className="bg-secondary flex justify-around items-center text-wrap rounded-xl w-[600px] shadow-sm mx-auto">
        <div className="w-[600px]">
          <Toaster/>
          {children}
        </div>
        </nav>
      </div>
    </div>
  )
}

export default ProtectedLayout;