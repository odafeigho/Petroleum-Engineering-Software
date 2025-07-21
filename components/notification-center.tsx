"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, X, Check, Settings } from "lucide-react"
import { notificationService, type ProcessingNotification } from "../lib/notifications/notification-service"
import { useI18n } from "../lib/i18n/context"

export function NotificationCenter() {
  const { t } = useI18n()
  const [notifications, setNotifications] = useState<ProcessingNotification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const handleNotification = (notification: ProcessingNotification) => {
      setNotifications((prev) => [notification, ...prev.slice(0, 49)]) // Keep only 50 notifications
      if (!notification.read) {
        setUnreadCount((prev) => prev + 1)
      }
    }

    notificationService.subscribe("notification-center", handleNotification)

    return () => {
      notificationService.unsubscribe("notification-center")
    }
  }, [])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => {
        if (notification.id === id && !notification.read) {
          setUnreadCount((count) => Math.max(0, count - 1))
          return { ...notification, read: true }
        }
        return notification
      }),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    setUnreadCount(0)
  }

  const clearNotifications = () => {
    setNotifications([])
    setUnreadCount(0)
  }

  const getNotificationIcon = (type: ProcessingNotification["type"]) => {
    switch (type) {
      case "success":
        return "✅"
      case "error":
        return "❌"
      case "upload":
        return "📤"
      case "normalize":
        return "⚙️"
      case "integrate":
        return "🔗"
      case "export":
        return "📥"
      default:
        return "ℹ️"
    }
  }

  const getNotificationColor = (type: ProcessingNotification["type"]) => {
    switch (type) {
      case "success":
        return "text-green-400"
      case "error":
        return "text-red-400"
      case "upload":
        return "text-blue-400"
      case "normalize":
        return "text-yellow-400"
      case "integrate":
        return "text-purple-400"
      case "export":
        return "text-cyan-400"
      default:
        return "text-slate-400"
    }
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative text-slate-400 hover:text-slate-200">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-slate-800 border-slate-700" align="end">
        <Card className="border-0 bg-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-200 text-lg">{t.notifications.title}</CardTitle>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs text-slate-400 hover:text-slate-200"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      {t.notifications.markAllRead}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearNotifications}
                      className="text-xs text-slate-400 hover:text-slate-200"
                    >
                      <X className="h-3 w-3 mr-1" />
                      {t.notifications.clear}
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open("/settings", "_blank")}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {unreadCount > 0 && (
              <CardDescription className="text-slate-400">
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>{t.notifications.noNotifications}</p>
              </div>
            ) : (
              <ScrollArea className="h-96">
                <div className="space-y-1 p-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                        notification.read
                          ? "bg-slate-800/30 border-slate-700/50"
                          : "bg-slate-700/50 border-slate-600/50"
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-lg">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`font-medium text-sm ${getNotificationColor(notification.type)}`}>
                              {notification.stage}
                            </p>
                            {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                          </div>
                          <p className="text-sm text-slate-300 mb-1">{notification.message}</p>
                          {notification.datasetName && (
                            <p className="text-xs text-slate-400 mb-1">Dataset: {notification.datasetName}</p>
                          )}
                          {notification.progress !== undefined && (
                            <div className="w-full bg-slate-700 rounded-full h-1.5 mb-1">
                              <div
                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${notification.progress}%` }}
                              />
                            </div>
                          )}
                          <p className="text-xs text-slate-500">{formatTime(notification.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
