"use client"
import { registerServceWorker } from "@/lib/serviceWorker"
import { useEffect } from "react"

export default function RegisterServiceWorker() {
  useEffect(() => {
    async function register() {
      await registerServceWorker()
    }
    register()
  }, [])
  return null
}
