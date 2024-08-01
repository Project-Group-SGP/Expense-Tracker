import React from "react";

import { Toaster } from "@/components/ui/sonner";

const ProtectedLayout = ({children}:{children:React.ReactNode}) => {
  return (
        <div>
          <Toaster/>
          {children}
        </div>
  )
}

export default ProtectedLayout;