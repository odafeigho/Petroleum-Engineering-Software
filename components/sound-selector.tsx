"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Volume2, VolumeX, Play, Trash2, Music, Plus, AlertTriangle, Loader2 } from "lucide-react"
import { soundManager, type NotificationSound, type SoundPreferences } from "../lib/notifications/sound-manager"

interface SoundSelectorProps {
  value: string
  onValueChange: (value: string) => void
  label: string
  description?: string
}

export function SoundSelector({ value, onValueChange, label, description }: SoundSelectorProps) {
  const [sounds, setSounds] = useState<NotificationSound[]>([])
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeSounds = async () => {
      try {
        await soundManager.waitForInitialization()
        setSounds(soundManager.getAllSounds())
        setIsInitialized(true)
      } catch (error) {
        console.error("Failed to initialize sounds:", error)
      }
    }

    initializeSounds()
  }, [])

  const handlePlaySound = async (soundId: string) => {
    if (isPlaying === soundId || !isInitialized) return

    setIsPlaying(soundId)
    try {
      await soundManager.testSound(soundId)
    } catch (error) {
      console.error("Failed to play sound:", error)
    } finally {
      setTimeout(() => setIsPlaying(null), 2000)
    }
  }

  const selectedSound = sounds.find((s) => s.id === value)

  if (!isInitialized) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{label}</Label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        <div className="flex items-center gap-2 p-2 border rounded">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Loading sounds...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}

      <div className="flex items-center gap-2">
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className="flex-1">
            <SelectValue>
              {selectedSound ? (
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4" />
                  <span>{selectedSound.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedSound.category}
                  </Badge>
                </div>
              ) : (
                "Select sound"
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <div className="p-2">
              <Label className="text-xs font-medium text-muted-foreground">BUILT-IN SOUNDS</Label>
            </div>
            {sounds
              .filter((s) => s.category === "built-in")
              .map((sound) => (
                <SelectItem key={sound.id} value={sound.id}>
                  <div className="flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{sound.name}</div>
                      <div className="text-xs text-muted-foreground">{sound.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}

            {sounds.some((s) => s.category === "custom") && (
              <>
                <Separator className="my-2" />
                <div className="p-2">
                  <Label className="text-xs font-medium text-muted-foreground">CUSTOM SOUNDS</Label>
                </div>
                {sounds
                  .filter((s) => s.category === "custom")
                  .map((sound) => (
                    <SelectItem key={sound.id} value={sound.id}>
                      <div className="flex items-center gap-2">
                        <Music className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{sound.name}</div>
                          <div className="text-xs text-muted-foreground">{sound.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
              </>
            )}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePlaySound(value)}
          disabled={isPlaying === value || !value || !isInitialized}
        >
          {isPlaying === value ? <Volume2 className="h-4 w-4 animate-pulse" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}

export function SoundSettings() {
  const [preferences, setPreferences] = useState<SoundPreferences>(soundManager.getPreferences())
  const [sounds, setSounds] = useState<NotificationSound[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const initializeSounds = async () => {
      try {
        await soundManager.waitForInitialization()
        setSounds(soundManager.getAllSounds())
        setIsInitialized(true)
      } catch (error) {
        console.error("Failed to initialize sounds:", error)
      }
    }

    initializeSounds()
  }, [])

  const updatePreference = <K extends keyof SoundPreferences>(key: K, value: SoundPreferences[K]) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    soundManager.updatePreferences({ [key]: value })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const customSound = await soundManager.uploadCustomSound(file)
      setSounds(soundManager.getAllSounds())

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Failed to upload sound")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteCustomSound = async (soundId: string) => {
    const success = soundManager.deleteCustomSound(soundId)
    if (success) {
      setSounds(soundManager.getAllSounds())
      // Update preferences if needed
      setPreferences(soundManager.getPreferences())
    }
  }

  const handleTestSound = async (soundId: string) => {
    if (!isInitialized) return

    try {
      await soundManager.testSound(soundId, preferences.volume)
    } catch (error) {
      console.error("Failed to test sound:", error)
    }
  }

  const customSounds = sounds.filter((s) => s.category === "custom")

  if (!soundManager.isSupported()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <VolumeX className="h-5 w-5" />
            Audio Not Supported
          </CardTitle>
          <CardDescription>
            Your browser doesn't support the Web Audio API. Sound notifications are not available.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!isInitialized) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading Sound System
          </CardTitle>
          <CardDescription>Initializing audio system and generating notification sounds...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Sound Settings
          </CardTitle>
          <CardDescription>Customize notification sounds for different types of events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Master Volume */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Master Volume</Label>
              <span className="text-sm text-muted-foreground">{preferences.volume}%</span>
            </div>
            <Slider
              value={[preferences.volume]}
              onValueChange={([value]) => updatePreference("volume", value)}
              max={100}
              step={5}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Sound Assignments */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Sound Assignments</Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SoundSelector
                value={preferences.uploadSound}
                onValueChange={(value) => updatePreference("uploadSound", value)}
                label="Upload Notifications"
                description="Sound for data upload events"
              />

              <SoundSelector
                value={preferences.normalizeSound}
                onValueChange={(value) => updatePreference("normalizeSound", value)}
                label="Normalization Progress"
                description="Sound for normalization updates"
              />

              <SoundSelector
                value={preferences.integrateSound}
                onValueChange={(value) => updatePreference("integrateSound", value)}
                label="Integration Events"
                description="Sound for data integration"
              />

              <SoundSelector
                value={preferences.exportSound}
                onValueChange={(value) => updatePreference("exportSound", value)}
                label="Export Complete"
                description="Sound for export completion"
              />

              <SoundSelector
                value={preferences.successSound}
                onValueChange={(value) => updatePreference("successSound", value)}
                label="Success Notifications"
                description="Sound for successful operations"
              />

              <SoundSelector
                value={preferences.errorSound}
                onValueChange={(value) => updatePreference("errorSound", value)}
                label="Error Alerts"
                description="Sound for error notifications"
              />
            </div>
          </div>

          <Separator />

          {/* Default Sound */}
          <SoundSelector
            value={preferences.defaultSound}
            onValueChange={(value) => updatePreference("defaultSound", value)}
            label="Default Sound"
            description="Fallback sound for unspecified notification types"
          />
        </CardContent>
      </Card>

      {/* Custom Sounds Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            Custom Sounds
          </CardTitle>
          <CardDescription>
            Upload your own notification sounds. Supported formats: MP3, WAV, OGG (max 5MB)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Section */}
          <div className="flex items-center gap-4">
            <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Upload Custom Sound
                </>
              )}
            </Button>
          </div>

          {uploadError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Upload Failed</p>
                  <p className="text-sm text-red-700">{uploadError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Custom Sounds List */}
          {customSounds.length > 0 ? (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Your Custom Sounds</Label>
              <ScrollArea className="h-48 border rounded-lg p-2">
                <div className="space-y-2">
                  {customSounds.map((sound) => (
                    <div key={sound.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Music className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm">{sound.name}</p>
                          <p className="text-xs text-muted-foreground">Duration: {sound.duration.toFixed(1)}s</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleTestSound(sound.id)}>
                          <Play className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Custom Sound</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{sound.name}"? This action cannot be undone. Any
                                notification settings using this sound will be reset to default.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCustomSound(sound.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Music className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No custom sounds uploaded yet</p>
              <p className="text-sm">Upload your own sounds to personalize notifications</p>
            </div>
          )}

          {/* Upload Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Upload Guidelines</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Supported formats: MP3, WAV, OGG, M4A</li>
              <li>• Maximum file size: 5MB</li>
              <li>• Recommended duration: 0.5-3 seconds</li>
              <li>• For best results, use clear, distinct sounds</li>
              <li>• Avoid very loud or jarring sounds</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
