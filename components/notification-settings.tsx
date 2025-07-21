"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, BellOff, Check, X, AlertTriangle, Volume2 } from "lucide-react"
import { notificationService } from "../lib/notifications/notification-service"
import { SoundSettings } from "./sound-selector"

interface NotificationPreferences {
  enabled: boolean
  uploadNotifications: boolean
  normalizationNotifications: boolean
  integrationNotifications: boolean
  exportNotifications: boolean
  errorNotifications: boolean
  successNotifications: boolean
  soundEnabled: boolean
  requireInteraction: boolean
}

export function NotificationSettings() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enabled: false,
    uploadNotifications: true,
    normalizationNotifications: true,
    integrationNotifications: true,
    exportNotifications: true,
    errorNotifications: true,
    successNotifications: true,
    soundEnabled: true,
    requireInteraction: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [testNotificationSent, setTestNotificationSent] = useState(false)

  useEffect(() => {
    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem("notification-preferences")
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences))
      } catch (error) {
        console.error("Failed to load notification preferences:", error)
      }
    }

    // Get current permission status
    setPermission(notificationService.getPermissionStatus())
  }, [])

  useEffect(() => {
    // Save preferences to localStorage
    localStorage.setItem("notification-preferences", JSON.stringify(preferences))
  }, [preferences])

  const handleRequestPermission = async () => {
    setIsLoading(true)
    try {
      const newPermission = await notificationService.requestPermission()
      setPermission(newPermission)

      if (newPermission === "granted") {
        setPreferences((prev) => ({ ...prev, enabled: true }))
      }
    } catch (error) {
      console.error("Failed to request notification permission:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestNotification = async () => {
    if (permission !== "granted") return

    await notificationService.showProcessingNotification({
      type: "success",
      stage: "test",
      message: "Test notification sent successfully! Your notifications are working correctly.",
      timestamp: Date.now(),
    })

    setTestNotificationSent(true)
    setTimeout(() => setTestNotificationSent(false), 3000)
  }

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const getPermissionBadge = () => {
    switch (permission) {
      case "granted":
        return (
          <Badge className="bg-green-500">
            <Check className="h-3 w-3 mr-1" />
            Granted
          </Badge>
        )
      case "denied":
        return (
          <Badge variant="destructive">
            <X className="h-3 w-3 mr-1" />
            Denied
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Not Set
          </Badge>
        )
    }
  }

  if (!notificationService.isSupported()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Notifications Not Supported
          </CardTitle>
          <CardDescription>
            Your browser doesn't support push notifications. Please use a modern browser like Chrome, Firefox, Safari,
            or Edge.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="notifications" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="sounds" className="flex items-center gap-2">
          <Volume2 className="h-4 w-4" />
          Sounds
        </TabsTrigger>
      </TabsList>

      <TabsContent value="notifications" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure push notifications for data processing updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Permission Status */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Permission Status</Label>
                <p className="text-sm text-muted-foreground">Current notification permission level</p>
              </div>
              <div className="flex items-center gap-2">
                {getPermissionBadge()}
                {permission !== "granted" && (
                  <Button onClick={handleRequestPermission} disabled={isLoading} size="sm">
                    {isLoading ? "Requesting..." : "Enable Notifications"}
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            {/* Master Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications-enabled" className="text-base font-medium">
                  Enable Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive push notifications for data processing updates</p>
              </div>
              <Switch
                id="notifications-enabled"
                checked={preferences.enabled && permission === "granted"}
                onCheckedChange={(checked) => updatePreference("enabled", checked)}
                disabled={permission !== "granted"}
              />
            </div>

            {preferences.enabled && permission === "granted" && (
              <>
                <Separator />

                {/* Notification Types */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Notification Types</Label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="upload-notifications" className="text-sm">
                        Data Upload
                      </Label>
                      <Switch
                        id="upload-notifications"
                        checked={preferences.uploadNotifications}
                        onCheckedChange={(checked) => updatePreference("uploadNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="normalization-notifications" className="text-sm">
                        Data Normalization
                      </Label>
                      <Switch
                        id="normalization-notifications"
                        checked={preferences.normalizationNotifications}
                        onCheckedChange={(checked) => updatePreference("normalizationNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="integration-notifications" className="text-sm">
                        Data Integration
                      </Label>
                      <Switch
                        id="integration-notifications"
                        checked={preferences.integrationNotifications}
                        onCheckedChange={(checked) => updatePreference("integrationNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="export-notifications" className="text-sm">
                        Data Export
                      </Label>
                      <Switch
                        id="export-notifications"
                        checked={preferences.exportNotifications}
                        onCheckedChange={(checked) => updatePreference("exportNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="error-notifications" className="text-sm">
                        Error Alerts
                      </Label>
                      <Switch
                        id="error-notifications"
                        checked={preferences.errorNotifications}
                        onCheckedChange={(checked) => updatePreference("errorNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="success-notifications" className="text-sm">
                        Success Messages
                      </Label>
                      <Switch
                        id="success-notifications"
                        checked={preferences.successNotifications}
                        onCheckedChange={(checked) => updatePreference("successNotifications", checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Advanced Settings */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Advanced Settings</Label>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sound-enabled" className="text-sm">
                          Sound Notifications
                        </Label>
                        <p className="text-xs text-muted-foreground">Play sound with notifications</p>
                      </div>
                      <Switch
                        id="sound-enabled"
                        checked={preferences.soundEnabled}
                        onCheckedChange={(checked) => updatePreference("soundEnabled", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="require-interaction" className="text-sm">
                          Require Interaction
                        </Label>
                        <p className="text-xs text-muted-foreground">Keep notifications visible until clicked</p>
                      </div>
                      <Switch
                        id="require-interaction"
                        checked={preferences.requireInteraction}
                        onCheckedChange={(checked) => updatePreference("requireInteraction", checked)}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Test Notification */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Test Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send a test notification to verify your settings</p>
                  </div>
                  <Button onClick={handleTestNotification} variant="outline" size="sm" disabled={testNotificationSent}>
                    {testNotificationSent ? "Sent!" : "Send Test"}
                  </Button>
                </div>
              </>
            )}

            {permission === "denied" && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-800">Notifications Blocked</h4>
                    <p className="text-sm text-orange-700 mt-1">
                      Notifications have been blocked for this site. To enable them:
                    </p>
                    <ol className="text-sm text-orange-700 mt-2 space-y-1">
                      <li>1. Click the lock icon in your browser's address bar</li>
                      <li>2. Change notifications from "Block" to "Allow"</li>
                      <li>3. Refresh this page</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sounds">
        <SoundSettings />
      </TabsContent>
    </Tabs>
  )
}
