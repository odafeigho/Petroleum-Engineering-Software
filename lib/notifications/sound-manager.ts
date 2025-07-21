export interface NotificationSound {
  id: string
  name: string
  description: string
  url?: string
  duration: number
  category: "built-in" | "custom"
  preview?: boolean
}

export interface SoundPreferences {
  enabled: boolean
  volume: number
  uploadSound: string
  normalizeSound: string
  integrateSound: string
  exportSound: string
  successSound: string
  errorSound: string
  defaultSound: string
}

export class SoundManager {
  private static instance: SoundManager
  private audioContext: AudioContext | null = null
  private sounds: Map<string, AudioBuffer> = new Map()
  private preferences: SoundPreferences
  private isInitialized = false

  // Built-in notification sounds (generated programmatically)
  private readonly builtInSounds: NotificationSound[] = [
    {
      id: "default",
      name: "Default",
      description: "Standard notification sound",
      duration: 0.5,
      category: "built-in",
    },
    {
      id: "success",
      name: "Success Chime",
      description: "Pleasant success notification",
      duration: 1.0,
      category: "built-in",
    },
    {
      id: "error",
      name: "Error Alert",
      description: "Attention-grabbing error sound",
      duration: 0.8,
      category: "built-in",
    },
    {
      id: "progress",
      name: "Progress Ping",
      description: "Subtle progress notification",
      duration: 0.3,
      category: "built-in",
    },
    {
      id: "complete",
      name: "Task Complete",
      description: "Satisfying completion sound",
      duration: 1.5,
      category: "built-in",
    },
    {
      id: "gentle",
      name: "Gentle Bell",
      description: "Soft, non-intrusive notification",
      duration: 1.2,
      category: "built-in",
    },
    {
      id: "modern",
      name: "Modern Beep",
      description: "Contemporary notification sound",
      duration: 0.4,
      category: "built-in",
    },
    {
      id: "classic",
      name: "Classic Ding",
      description: "Traditional notification bell",
      duration: 0.8,
      category: "built-in",
    },
  ]

  private constructor() {
    this.preferences = this.loadPreferences()
    this.initializeAudioContext()
  }

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager()
    }
    return SoundManager.instance
  }

  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Generate built-in sounds
      await this.generateBuiltInSounds()

      this.isInitialized = true
      console.log("Sound manager initialized successfully")
    } catch (error) {
      console.error("Failed to initialize audio context:", error)
      this.isInitialized = false
    }
  }

  private async generateBuiltInSounds() {
    if (!this.audioContext) return

    try {
      // Generate each built-in sound
      const soundGenerators = {
        default: () => this.generateTone(800, 0.5, "sine", 0.3),
        success: () => this.generateChord([523, 659, 784], 1.0, 0.25),
        error: () =>
          this.generateSequence(
            [
              { frequency: 800, duration: 0.2, type: "square" as OscillatorType },
              { frequency: 600, duration: 0.2, type: "square" as OscillatorType },
              { frequency: 400, duration: 0.4, type: "square" as OscillatorType },
            ],
            0.3,
          ),
        progress: () => this.generateTone(1000, 0.3, "sine", 0.2),
        complete: () =>
          this.generateSequence(
            [
              { frequency: 523, duration: 0.3, type: "sine" as OscillatorType },
              { frequency: 659, duration: 0.3, type: "sine" as OscillatorType },
              { frequency: 784, duration: 0.3, type: "sine" as OscillatorType },
              { frequency: 1047, duration: 0.6, type: "sine" as OscillatorType },
            ],
            0.3,
          ),
        gentle: () => this.generateTone(440, 1.2, "sine", 0.15),
        modern: () => this.generateTone(1200, 0.4, "square", 0.25),
        classic: () => this.generateTone(660, 0.8, "triangle", 0.2),
      }

      for (const [soundId, generator] of Object.entries(soundGenerators)) {
        try {
          const buffer = await generator()
          this.sounds.set(soundId, buffer)
        } catch (error) {
          console.warn(`Failed to generate sound ${soundId}:`, error)
        }
      }

      console.log(`Generated ${this.sounds.size} built-in sounds`)
    } catch (error) {
      console.error("Failed to generate built-in sounds:", error)
    }
  }

  private async generateTone(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
    volume = 0.3,
  ): Promise<AudioBuffer> {
    if (!this.audioContext) {
      throw new Error("Audio context not initialized")
    }

    const sampleRate = this.audioContext.sampleRate
    const numSamples = Math.floor(sampleRate * duration)
    const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate)
    const channelData = buffer.getChannelData(0)

    // Generate tone with envelope
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate
      let sample = 0

      switch (type) {
        case "sine":
          sample = Math.sin(2 * Math.PI * frequency * t)
          break
        case "square":
          sample = Math.sign(Math.sin(2 * Math.PI * frequency * t))
          break
        case "triangle":
          sample = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * t))
          break
        case "sawtooth":
          sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5))
          break
      }

      // Apply envelope (fade in/out)
      const fadeTime = Math.min(0.05, duration * 0.1) // 5% of duration or 50ms max
      const fadeSamples = Math.floor(fadeTime * sampleRate)

      if (i < fadeSamples) {
        sample *= i / fadeSamples // Fade in
      } else if (i > numSamples - fadeSamples) {
        sample *= (numSamples - i) / fadeSamples // Fade out
      }

      channelData[i] = sample * volume
    }

    return buffer
  }

  private async generateChord(frequencies: number[], duration: number, volume = 0.3): Promise<AudioBuffer> {
    if (!this.audioContext) {
      throw new Error("Audio context not initialized")
    }

    const sampleRate = this.audioContext.sampleRate
    const numSamples = Math.floor(sampleRate * duration)
    const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate)
    const channelData = buffer.getChannelData(0)

    // Generate chord by combining frequencies
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate
      let sample = 0

      // Add all frequencies together
      for (const frequency of frequencies) {
        sample += Math.sin(2 * Math.PI * frequency * t) / frequencies.length
      }

      // Apply envelope
      const fadeTime = Math.min(0.1, duration * 0.2)
      const fadeSamples = Math.floor(fadeTime * sampleRate)

      if (i < fadeSamples) {
        sample *= i / fadeSamples
      } else if (i > numSamples - fadeSamples) {
        sample *= (numSamples - i) / fadeSamples
      }

      channelData[i] = sample * volume
    }

    return buffer
  }

  private async generateSequence(
    tones: Array<{ frequency: number; duration: number; type: OscillatorType }>,
    volume: number,
  ): Promise<AudioBuffer> {
    if (!this.audioContext) {
      throw new Error("Audio context not initialized")
    }

    const totalDuration = tones.reduce((sum, tone) => sum + tone.duration, 0)
    const sampleRate = this.audioContext.sampleRate
    const numSamples = Math.floor(sampleRate * totalDuration)
    const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate)
    const channelData = buffer.getChannelData(0)

    let currentSample = 0
    for (const tone of tones) {
      const toneSamples = Math.floor(sampleRate * tone.duration)

      for (let i = 0; i < toneSamples && currentSample < numSamples; i++, currentSample++) {
        const t = i / sampleRate
        let sample = 0

        switch (tone.type) {
          case "sine":
            sample = Math.sin(2 * Math.PI * tone.frequency * t)
            break
          case "square":
            sample = Math.sign(Math.sin(2 * Math.PI * tone.frequency * t))
            break
          case "triangle":
            sample = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * tone.frequency * t))
            break
          case "sawtooth":
            sample = 2 * (t * tone.frequency - Math.floor(t * tone.frequency + 0.5))
            break
        }

        // Apply envelope for each tone
        const fadeTime = Math.min(0.02, tone.duration * 0.1)
        const fadeSamples = Math.floor(fadeTime * sampleRate)

        if (i < fadeSamples) {
          sample *= i / fadeSamples
        } else if (i > toneSamples - fadeSamples) {
          sample *= (toneSamples - i) / fadeSamples
        }

        channelData[currentSample] = sample * volume
      }
    }

    return buffer
  }

  private async loadSound(id: string, url: string): Promise<AudioBuffer> {
    if (!this.audioContext) {
      throw new Error("Audio context not initialized")
    }

    if (this.sounds.has(id)) {
      return this.sounds.get(id)!
    }

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.status}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)

      this.sounds.set(id, audioBuffer)
      return audioBuffer
    } catch (error) {
      console.error(`Failed to load sound ${id}:`, error)
      throw error
    }
  }

  async playSound(soundId: string, volume?: number): Promise<void> {
    if (!this.preferences.enabled || !this.audioContext || !this.isInitialized) {
      return
    }

    try {
      // Resume audio context if suspended (required by some browsers)
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume()
      }

      const audioBuffer = this.sounds.get(soundId)
      if (!audioBuffer) {
        console.warn(`Sound ${soundId} not found`)
        return
      }

      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()

      source.buffer = audioBuffer
      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      // Set volume
      const finalVolume = (volume ?? this.preferences.volume) / 100
      gainNode.gain.setValueAtTime(finalVolume, this.audioContext.currentTime)

      source.start(0)
    } catch (error) {
      console.error(`Failed to play sound ${soundId}:`, error)
    }
  }

  async playNotificationSound(
    type: keyof Omit<SoundPreferences, "enabled" | "volume" | "defaultSound">,
  ): Promise<void> {
    const soundId = this.preferences[type] || this.preferences.defaultSound
    await this.playSound(soundId)
  }

  async uploadCustomSound(file: File): Promise<NotificationSound> {
    if (!file.type.startsWith("audio/")) {
      throw new Error("File must be an audio file")
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      throw new Error("Audio file must be smaller than 5MB")
    }

    if (!this.audioContext) {
      throw new Error("Audio context not initialized")
    }

    try {
      // Read file as array buffer
      const arrayBuffer = await file.arrayBuffer()

      // Decode audio data
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)

      // Create object URL for storage reference
      const url = URL.createObjectURL(file)
      const id = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Store the audio buffer
      this.sounds.set(id, audioBuffer)

      const customSound: NotificationSound = {
        id,
        name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        description: `Custom sound: ${file.name}`,
        url,
        duration: audioBuffer.duration,
        category: "custom",
      }

      // Save to localStorage
      this.saveCustomSound(customSound)

      return customSound
    } catch (error) {
      console.error("Failed to upload custom sound:", error)
      throw new Error("Failed to process audio file. Please ensure it's a valid audio format.")
    }
  }

  getBuiltInSounds(): NotificationSound[] {
    return [...this.builtInSounds]
  }

  getCustomSounds(): NotificationSound[] {
    const customSounds = localStorage.getItem("custom-notification-sounds")
    if (!customSounds) return []

    try {
      return JSON.parse(customSounds)
    } catch (error) {
      console.error("Failed to load custom sounds:", error)
      return []
    }
  }

  getAllSounds(): NotificationSound[] {
    return [...this.builtInSounds, ...this.getCustomSounds()]
  }

  private saveCustomSound(sound: NotificationSound) {
    const customSounds = this.getCustomSounds()
    customSounds.push(sound)
    localStorage.setItem("custom-notification-sounds", JSON.stringify(customSounds))
  }

  deleteCustomSound(soundId: string): boolean {
    const customSounds = this.getCustomSounds()
    const index = customSounds.findIndex((s) => s.id === soundId)

    if (index === -1) return false

    // Revoke object URL to free memory
    const sound = customSounds[index]
    if (sound.url && sound.url.startsWith("blob:")) {
      URL.revokeObjectURL(sound.url)
    }

    // Remove from audio buffers
    this.sounds.delete(soundId)

    // Remove from storage
    customSounds.splice(index, 1)
    localStorage.setItem("custom-notification-sounds", JSON.stringify(customSounds))

    // Update preferences if this sound was selected
    this.updatePreferencesAfterDeletion(soundId)

    return true
  }

  private updatePreferencesAfterDeletion(deletedSoundId: string) {
    let updated = false
    const newPreferences = { ...this.preferences }

    // Check each sound preference and reset to default if using deleted sound
    const soundKeys: (keyof SoundPreferences)[] = [
      "uploadSound",
      "normalizeSound",
      "integrateSound",
      "exportSound",
      "successSound",
      "errorSound",
      "defaultSound",
    ]

    soundKeys.forEach((key) => {
      if (newPreferences[key] === deletedSoundId) {
        newPreferences[key] = "default"
        updated = true
      }
    })

    if (updated) {
      this.preferences = newPreferences
      this.savePreferences()
    }
  }

  getPreferences(): SoundPreferences {
    return { ...this.preferences }
  }

  updatePreferences(newPreferences: Partial<SoundPreferences>) {
    this.preferences = { ...this.preferences, ...newPreferences }
    this.savePreferences()
  }

  private loadPreferences(): SoundPreferences {
    const saved = localStorage.getItem("notification-sound-preferences")
    if (saved) {
      try {
        return { ...this.getDefaultPreferences(), ...JSON.parse(saved) }
      } catch (error) {
        console.error("Failed to load sound preferences:", error)
      }
    }
    return this.getDefaultPreferences()
  }

  private savePreferences() {
    localStorage.setItem("notification-sound-preferences", JSON.stringify(this.preferences))
  }

  private getDefaultPreferences(): SoundPreferences {
    return {
      enabled: true,
      volume: 70,
      uploadSound: "progress",
      normalizeSound: "progress",
      integrateSound: "modern",
      exportSound: "complete",
      successSound: "success",
      errorSound: "error",
      defaultSound: "default",
    }
  }

  async testSound(soundId: string, volume?: number): Promise<void> {
    await this.playSound(soundId, volume)
  }

  isSupported(): boolean {
    return !!(window.AudioContext || (window as any).webkitAudioContext)
  }

  isInitialized(): boolean {
    return this.isInitialized
  }

  async waitForInitialization(): Promise<void> {
    if (this.isInitialized) return

    return new Promise((resolve) => {
      const checkInitialized = () => {
        if (this.isInitialized) {
          resolve()
        } else {
          setTimeout(checkInitialized, 100)
        }
      }
      checkInitialized()
    })
  }

  cleanup() {
    // Clean up object URLs for custom sounds
    this.getCustomSounds().forEach((sound) => {
      if (sound.url && sound.url.startsWith("blob:")) {
        URL.revokeObjectURL(sound.url)
      }
    })

    if (this.audioContext) {
      this.audioContext.close()
    }
  }
}

// Export singleton instance
export const soundManager = SoundManager.getInstance()
