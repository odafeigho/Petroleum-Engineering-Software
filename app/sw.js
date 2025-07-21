const CACHE_NAME = "reservoir-data-harmonizer-v1.0.0"
const STATIC_CACHE_NAME = "rdh-static-v1.0.0"
const DYNAMIC_CACHE_NAME = "rdh-dynamic-v1.0.0"

// Files to cache for offline functionality
const STATIC_FILES = [
  "/",
  "/user-guide",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  // Add other critical assets
]

// Install event - cache static files
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...")
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching static files")
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        console.log("Service Worker: Static files cached")
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error("Service Worker: Error caching static files", error)
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...")
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log("Service Worker: Deleting old cache", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("Service Worker: Activated")
        return self.clients.claim()
      }),
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith("http")) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        return cachedResponse
      }

      // Otherwise fetch from network
      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response for caching
          const responseToCache = response.clone()

          // Cache dynamic content
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match("/")
          }
        })
    }),
  )
})

// Background sync for data uploads when back online
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync-data") {
    event.waitUntil(
      // Handle background sync for data uploads
      syncDataUploads(),
    )
  }
})

// Push notifications
self.addEventListener("push", (event) => {
  let data = {}

  if (event.data) {
    try {
      data = event.data.json()
    } catch (error) {
      data = { title: "Reservoir Data Harmonizer", body: event.data.text() }
    }
  }

  const options = {
    body: data.body || "New update available",
    icon: data.icon || "/icons/icon-192x192.png",
    badge: data.badge || "/icons/icon-72x72.png",
    vibrate: data.vibrate || [100, 50, 100],
    data: data.data || {},
    actions: data.actions || [
      {
        action: "open",
        title: "Open App",
        icon: "/icons/icon-96x96.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icons/close-96x96.png",
      },
    ],
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false,
    tag: data.tag || "general",
    timestamp: Date.now(),
  }

  event.waitUntil(self.registration.showNotification(data.title || "Reservoir Data Harmonizer", options))
})

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  const action = event.action
  const data = event.notification.data

  switch (action) {
    case "open":
    case "view":
      event.waitUntil(
        clients.matchAll({ type: "window" }).then((clientList) => {
          // If app is already open, focus it
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && "focus" in client) {
              return client.focus()
            }
          }
          // Otherwise open new window
          if (clients.openWindow) {
            return clients.openWindow("/")
          }
        }),
      )
      break

    case "download":
      // Handle download action
      event.waitUntil(
        clients.matchAll({ type: "window" }).then((clientList) => {
          if (clientList.length > 0) {
            clientList[0].postMessage({
              type: "DOWNLOAD_REQUEST",
              data: data,
            })
          }
        }),
      )
      break

    case "retry":
      // Handle retry action
      event.waitUntil(
        clients.matchAll({ type: "window" }).then((clientList) => {
          if (clientList.length > 0) {
            clientList[0].postMessage({
              type: "RETRY_REQUEST",
              data: data,
            })
          }
        }),
      )
      break

    case "help":
      // Open help/user guide
      event.waitUntil(clients.openWindow("/user-guide"))
      break

    case "close":
    default:
      // Just close the notification
      break
  }
})

// Message handler for communication with main app
self.addEventListener("message", (event) => {
  const { type, data } = event.data

  switch (type) {
    case "SHOW_NOTIFICATION":
      self.registration.showNotification(data.title, data.options)
      break

    case "CLEAR_NOTIFICATIONS":
      self.registration.getNotifications({ tag: data.tag }).then((notifications) => {
        notifications.forEach((notification) => notification.close())
      })
      break

    case "SKIP_WAITING":
      self.skipWaiting()
      break

    default:
      console.log("Unknown message type:", type)
  }
})

// Helper function for background sync
async function syncDataUploads() {
  try {
    // Get pending uploads from IndexedDB
    const pendingUploads = await getPendingUploads()

    for (const upload of pendingUploads) {
      try {
        // Process the upload
        await processUpload(upload)
        // Remove from pending uploads
        await removePendingUpload(upload.id)

        // Show success notification
        self.registration.showNotification("Data Sync Complete", {
          body: `Successfully synced ${upload.name}`,
          icon: "/icons/icon-192x192.png",
          tag: "sync-success",
        })
      } catch (error) {
        console.error("Failed to sync upload:", error)

        // Show error notification
        self.registration.showNotification("Sync Failed", {
          body: `Failed to sync ${upload.name}. Will retry later.`,
          icon: "/icons/icon-192x192.png",
          tag: "sync-error",
        })
      }
    }
  } catch (error) {
    console.error("Background sync failed:", error)
  }
}

// Placeholder functions for IndexedDB operations
async function getPendingUploads() {
  // Implementation would use IndexedDB to get pending uploads
  return []
}

async function processUpload(upload) {
  // Implementation would process the upload
  console.log("Processing upload:", upload)
}

async function removePendingUpload(id) {
  // Implementation would remove the upload from IndexedDB
  console.log("Removing pending upload:", id)
}
