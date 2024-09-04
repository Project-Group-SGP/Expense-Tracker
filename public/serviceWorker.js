// Service Worker Push Event Handler
self.addEventListener("push", function (event) {
  console.log("Push event received")
  if (event.data) {
    const data = event.data.json()
    const { title, body, type, data: customData } = data

    const notificationOptions = {
      body,
      icon: "/SpendWise-Icon.png",
      badge: "/SpendWise-Badge.png",
      tag: type || "default",
      data: customData,
      renotify: true,
    }

    event.waitUntil(
      self.registration
        .showNotification(title, notificationOptions)
        .then(() => console.log("Notification shown successfully"))
        .catch((error) => console.error("Error showing notification:", error))
    )
  }
})

// Service Worker Notification Click Event Handler
self.addEventListener("notificationclick", function (event) {
  const notification = event.notification
  const { type, url } = notification.data

  event.notification.close()

  event.waitUntil(
    clients
      .openWindow(url)
      .then((windowClient) => {
        if (windowClient) {
          return windowClient.focus()
        }
      })
      .catch((error) => {})
  )
})

// Service Worker Installation Event Handler
self.addEventListener("install", function (event) {
  event.waitUntil(self.skipWaiting())
})

// Service Worker Activation Event Handler
self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim())
})
