// Service Worker Push Event Handler
self.addEventListener("push", function (event) {
  console.log("Push event received")
  if (event.data) {
    const data = event.data.json()
    console.log("Received push data:", data)
    const { title, body, type, data: customData } = data

    const notificationOptions = {
      body,
      icon: "/SpendWise-Icon.png",
      badge: "/SpendWise-Badge.png",
      tag: type || "default",
      data: customData,
      renotify: true,
    }

    console.log("Notification options:", notificationOptions)

    event.waitUntil(
      self.registration
        .showNotification(title, notificationOptions)
        .then(() => console.log("Notification shown successfully"))
        .catch((error) => console.error("Error showing notification:", error))
    )
  } else {
    console.log("Push event received but no data")
  }
})

// Service Worker Notification Click Event Handler
self.addEventListener("notificationclick", function (event) {
  console.log("Notification clicked")
  const notification = event.notification
  const { type, url } = notification.data

  console.log("Notification type:", type)
  console.log("Notification data:", notification.data)

  event.notification.close()

  event.waitUntil(
    clients
      .openWindow(url)
      .then((windowClient) => {
        if (windowClient) {
          return windowClient.focus()
        }
      })
      .catch((error) => {
        console.error("Error opening window:", error)
      })
  )
})

// Service Worker Installation Event Handler
self.addEventListener("install", function (event) {
  console.log("Service Worker installed")
  event.waitUntil(self.skipWaiting())
})

// Service Worker Activation Event Handler
self.addEventListener("activate", function (event) {
  console.log("Service Worker activated")
  event.waitUntil(self.clients.claim())
})
