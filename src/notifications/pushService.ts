import { getReadyServiceWorker } from "@/lib/serviceWorker"

export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
  const sw = await getReadyServiceWorker()
  return sw.pushManager.getSubscription()
}

export async function registerPushNotifications() {
  if (!("PushManager" in window)) {
    throw Error("Push notifications are not supported by this browser")
  }

  const existingSubscription = await getCurrentPushSubscription()
  if (existingSubscription) {
    throw Error("Push notifications are already enabled")
  }
  const sw = await getReadyServiceWorker()

  const subscription = await sw.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY,
  })

  await sendPushSubscriptionToServer(subscription)
}

export async function unregisterPushNotification() {
  const existingSubscription = await getCurrentPushSubscription()
  if (!existingSubscription) {
    throw Error("Push notifications are not enabled")
  }

  await deletePushSubscriptionFromServer(existingSubscription)

  await existingSubscription.unsubscribe()
}

export async function sendPushSubscriptionToServer(
  subscription: PushSubscription
) {
  console.log("Sending subscription to server", subscription)
}

export async function deletePushSubscriptionFromServer(
  subscription: PushSubscription
) {
  console.log("Deleting subscription from server", subscription)
}
