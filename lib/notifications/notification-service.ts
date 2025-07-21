import { soundManager } from "./sound-manager"

export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: any
  actions?: NotificationAction[]
  requireInteraction?: boolean
  silent?: boolean
  soundType?: "upload" | "normalize" | "integrate" | "export" | "success" | "error" | "info"
}

export interface NotificationAction {
  action: string
  title: string
  icon?: string
}

export interface ProcessingNotification {
  id: string
  type: "upload" | "normalize" | "integrate" | "export" | "success" | "error" | "info"
  stage: string
  progress?: number
  message: string
  timestamp: number
  datasetName?: string
  read?: boolean
}

export class NotificationService {
  private static instance: NotificationService
  private permission: NotificationPermission = "default"
  private registration: ServiceWorkerRegistration | null = null
  private subscribers: Map<string, (notification: ProcessingNotification) => void> = new Map()
  private notifications: ProcessingNotification[] = []

  private constructor() {
    this.initializeService()
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  private async initializeService() {
    // Check if notifications are supported
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications")
      return
    }

    // Get current permission status
    this.permission = Notification.permission

    // Register service worker if available
    if ("serviceWorker" in navigator) {
      try {
        this.registration = await navigator.serviceWorker.ready
        console.log("Notification service initialized with service worker")
      } catch (error) {
        console.error("Failed to initialize service worker for notifications:", error)
      }
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      return "denied"
    }

    if (this.permission === "granted") {
      return "granted"
    }

    try {
      this.permission = await Notification.requestPermission()
      return this.permission
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      return "denied"
    }
  }

  async showNotification(payload: NotificationPayload): Promise<void> {
    if (this.permission !== "granted") {
      console.warn("Notification permission not granted")
      return
    }

    // Play sound if specified and not silent
    if (!payload.silent && payload.soundType) {
      try {
        await soundManager.playNotificationSound(`${payload.soundType}Sound` as any)
      } catch (error) {
        console.error("Failed to play notification sound:", error)
      }
    }

    const options: NotificationOptions = {
      body: payload.body,
      icon: payload.icon || "/icons/icon-192x192.png",
      badge: payload.badge || "/icons/icon-72x72.png",
      tag: payload.tag,
      data: payload.data,
      requireInteraction: payload.requireInteraction || false,
      silent: payload.silent || false,
      actions: payload.actions,
      vibrate: [200, 100, 200],
      timestamp: Date.now(),
    }

    try {
      if (this.registration) {
        // Use service worker for persistent notifications
        await this.registration.showNotification(payload.title, options)
      } else {
        // Fallback to regular notifications
        new Notification(payload.title, options)
      }
    } catch (error) {
      console.error("Failed to show notification:", error)
    }
  }

  async showProcessingNotification(notification: ProcessingNotification): Promise<void> {
    const { type, stage, progress, message, datasetName } = notification

    let title = "Reservoir Data Harmonizer"
    let body = message
    let icon = "/icons/icon-192x192.png"
    const tag = `processing-${type}`
    let requireInteraction = false
    let actions: NotificationAction[] = []
    let soundType: NotificationPayload["soundType"] = type

    switch (type) {
      case "upload":
        title = "Data Upload"
        icon = "/icons/upload-96x96.png"
        body = datasetName ? `Uploading ${datasetName}: ${message}` : message
        soundType = "upload"
        break

      case "normalize":
        title = "Data Normalization"
        icon = "/icons/normalize-96x96.png"
        body = progress !== undefined ? `Normalizing data: ${progress}% complete` : message
        soundType = "normalize"
        break

      case "integrate":
        title = "Data Integration"
        icon = "/icons/integrate-96x96.png"
        body = `Integrating datasets: ${message}`
        soundType = "integrate"
        break

      case "export":
        title = "Data Export"
        icon = "/icons/export-96x96.png"
        body = `Export complete: ${message}`
        soundType = "export"
        actions = [
          { action: "view", title: "View Results", icon: "/icons/view-96x96.png" },
          { action: "download", title: "Download", icon: "/icons/download-96x96.png" },
        ]
        requireInteraction = true
        break

      case "success":
        title = "✅ Success"
        body = message
        soundType = "success"
        actions = [{ action: "view", title: "View Results", icon: "/icons/view-96x96.png" }]
        requireInteraction = true
        break

      case "error":
        title = "❌ Error"
        body = `Error in ${stage}: ${message}`
        soundType = "error"
        actions = [
          { action: "retry", title: "Retry", icon: "/icons/retry-96x96.png" },
          { action: "help", title: "Get Help", icon: "/icons/help-96x96.png" },
        ]
        requireInteraction = true
        break

      case "info":
        title = "Info"
        body = message
        soundType = "info"
        break
    }

    await this.showNotification({
      title,
      body,
      icon,
      tag,
      requireInteraction,
      actions,
      data: notification,
      soundType,
    })

    // Notify subscribers
    this.notifySubscribers(notification)
  }

  subscribe(id: string, callback: (notification: ProcessingNotification) => void): void {
    this.subscribers.set(id, callback)
  }

  unsubscribe(id: string): void {
    this.subscribers.delete(id)
  }

  private notifySubscribers(notification: ProcessingNotification): void {
    this.subscribers.forEach((callback) => {
      try {
        callback(notification)
      } catch (error) {
        console.error("Error in notification subscriber:", error)
      }
    })
  }

  async scheduleNotification(payload: NotificationPayload, delay: number): Promise<void> {
    setTimeout(() => {
      this.showNotification(payload)
    }, delay)
  }

  async clearNotifications(tag?: string): Promise<void> {
    if (!this.registration) return

    try {
      const notifications = await this.registration.getNotifications({ tag })
      notifications.forEach((notification) => notification.close())
    } catch (error) {
      console.error("Failed to clear notifications:", error)
    }
  }

  getPermissionStatus(): NotificationPermission {
    return this.permission
  }

  isSupported(): boolean {
    return "Notification" in window
  }

  notify(notification: Omit<ProcessingNotification, "id" | "timestamp">) {
    const fullNotification: ProcessingNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    }

    this.notifications.push(fullNotification)

    // Notify all subscribers
    this.subscribers.forEach((callback) => {
      callback(fullNotification)
    })

    // Show browser notification if permission granted
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notification.stage, {
        body: notification.message,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
        tag: notification.type,
      })
    }
  }

  getNotifications(): ProcessingNotification[] {
    return this.notifications
  }

  clearAllNotifications() {
    this.notifications = []
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance()
