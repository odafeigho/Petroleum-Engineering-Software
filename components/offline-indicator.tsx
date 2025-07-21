"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
    }

    // Set initial status
    updateOnlineStatus()

    // Listen for online/offline events
    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  if (isOnline) {
    return (
      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 hidden sm:flex">
        <Wifi className="h-3 w-3 mr-1" />
        Online
      </Badge>
    )
  }

  return (
    <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
      <WifiOff className="h-3 w-3 mr-1" />
      Offline
    </Badge>
  )
}
