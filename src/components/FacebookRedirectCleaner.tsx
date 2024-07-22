"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function FacebookRedirectCleaner() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#_=_") {
      const cleanUrl = window.location.href.split("#")[0]
      window.history.replaceState({}, document.title, cleanUrl)
      // Optionally, you can use the router to refresh the page
      // router.replace(cleanUrl);
    }
  }, [router])

  return null
}
