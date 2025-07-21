"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Smartphone, Monitor, X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Check if app is already installed (standalone mode)
    const standalone = window.matchMedia("(display-mode: standalone)").matches
    setIsStandalone(standalone)

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)

      // Show install prompt after a short delay if not already installed
      if (!standalone) {
        setTimeout(() => {
          setShowInstallPrompt(true)
        }, 5000)
      }
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener)

    // Listen for app installed event
    window.addEventListener("appinstalled", () => {
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    })

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener)
      window.removeEventListener("appinstalled", () => {})
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  const dismissPrompt = () => {
    setShowInstallPrompt(false)
    // Don't show again for this session
    localStorage.setItem("pwa-install-dismissed", Date.now().toString())
  }

  // Don't show if already installed or recently dismissed
  if (isStandalone) return null

  const dismissed = localStorage.getItem("pwa-install-dismissed")
  if (dismissed && Date.now() - Number.parseInt(dismissed) < 24 * 60 * 60 * 1000) {
    return null
  }

  // iOS install instructions
  if (isIOS && !isStandalone) {
    return (
      <Dialog open={showInstallPrompt} onOpenChange={setShowInstallPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Install App
            </DialogTitle>
            <DialogDescription>Add Reservoir Data Harmonizer to your home screen for easy access</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white">1</div>
              <p className="text-sm">Tap the Share button in Safari</p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white">2</div>
              <p className="text-sm">Scroll down and tap "Add to Home Screen"</p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white">3</div>
              <p className="text-sm">Tap "Add" to install the app</p>
            </div>
            <Button onClick={dismissPrompt} variant="outline" className="w-full bg-transparent">
              <X className="h-4 w-4 mr-2" />
              Maybe Later
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Standard PWA install prompt
  if (deferredPrompt) {
    return (
      <Dialog open={showInstallPrompt} onOpenChange={setShowInstallPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Install App
            </DialogTitle>
            <DialogDescription>
              Install Reservoir Data Harmonizer for faster access and offline capabilities
            </DialogDescription>
          </DialogHeader>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Monitor className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Reservoir Data Harmonizer</h4>
                  <p className="text-sm text-muted-foreground">Professional Petroleum Engineering Software</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full" />
                  <span>Work offline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full" />
                  <span>Faster loading</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full" />
                  <span>Desktop notifications</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex gap-2">
            <Button onClick={dismissPrompt} variant="outline" className="flex-1 bg-transparent">
              Maybe Later
            </Button>
            <Button onClick={handleInstall} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Install
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return null
}
