self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json()
    const { title, body } = data
    console.log(data)

    async function handlePushEvevent() {
      const windowClients = await self.clients.matchAll({
        type: "window",
      })

      if (windowClients.length > 0) {
        const appInForeground = windowClients.some((client) => client.focused)
      }
      await self.registration.showNotification(title, {
        body,
      })
    }

    event.waitUntil(handlePushEvevent())
  } else {
    console.log("Push event but no data")
  }
})
