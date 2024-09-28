"use client"
import { registerServceWorker } from "@/lib/serviceWorker"
import {
  getCurrentPushSubscription,
  sendPushSubscriptionToServer,
} from "@/notifications/pushService"
import { useEffect } from "react"

export default function RegisterServiceWorker() {
  // console.log("Registering service worker...")
  useEffect(() => {
    async function register() {
      try {
        await registerServceWorker()
      } catch (error) {
        // console.error("Error registering service worker:", error)
      }
    }
    register()
  }, [])

  useEffect(() => {
    async function syncPushSubscription() {
      try {
        const subscription = await getCurrentPushSubscription()
        if (subscription) {
          await sendPushSubscriptionToServer(subscription)
        }
      } catch (error) {
        console.error("Error syncing push subscription:", error)
      }
    }

    syncPushSubscription()
  }, [])
  return null
}
