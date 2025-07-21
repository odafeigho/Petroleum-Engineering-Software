export interface PlatformInfo {
  name: string
  version: string
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  supportsInstall: boolean
  supportsNotifications: boolean
  supportsBackgroundSync: boolean
}

export function detectPlatform(): PlatformInfo {
  const userAgent = navigator.userAgent.toLowerCase()
  const platform = navigator.platform.toLowerCase()

  // Detect mobile devices
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)

  // Detect tablets
  const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent)

  // Detect desktop
  const isDesktop = !isMobile && !isTablet

  // Detect specific platforms
  let name = "Unknown"
  let version = "Unknown"

  if (userAgent.includes("android")) {
    name = "Android"
    const match = userAgent.match(/android\s([0-9.]*)/i)
    version = match ? match[1] : "Unknown"
  } else if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
    name = userAgent.includes("ipad") ? "iPadOS" : "iOS"
    const match = userAgent.match(/os\s([0-9_]*)/i)
    version = match ? match[1].replace(/_/g, ".") : "Unknown"
  } else if (userAgent.includes("mac")) {
    name = "macOS"
    const match = userAgent.match(/mac os x\s([0-9_]*)/i)
    version = match ? match[1].replace(/_/g, ".") : "Unknown"
  } else if (userAgent.includes("win")) {
    name = "Windows"
    if (userAgent.includes("windows nt 10.0")) {
      version = "10/11"
    } else if (userAgent.includes("windows nt 6.3")) {
      version = "8.1"
    } else if (userAgent.includes("windows nt 6.2")) {
      version = "8"
    } else if (userAgent.includes("windows nt 6.1")) {
      version = "7"
    } else {
      version = "Unknown"
    }
  } else if (userAgent.includes("linux")) {
    name = "Linux"
  }

  // Check for PWA capabilities
  const supportsInstall = "serviceWorker" in navigator && "BeforeInstallPromptEvent" in window
  const supportsNotifications = "Notification" in window
  const supportsBackgroundSync = "serviceWorker" in navigator && "sync" in window.ServiceWorkerRegistration.prototype

  return {
    name,
    version,
    isMobile,
    isTablet,
    isDesktop,
    supportsInstall,
    supportsNotifications,
    supportsBackgroundSync,
  }
}

export function getPlatformSpecificInstructions(platform: PlatformInfo) {
  switch (platform.name) {
    case "iOS":
    case "iPadOS":
      return {
        install: [
          "Open in Safari browser",
          "Tap the Share button (square with arrow)",
          'Scroll down and tap "Add to Home Screen"',
          'Tap "Add" to install the app',
        ],
        features: [
          "Works offline after installation",
          "Appears on home screen like native app",
          "Full screen experience",
          "Fast loading and smooth performance",
        ],
      }

    case "Android":
      return {
        install: [
          "Open in Chrome browser",
          "Tap the menu button (⋮)",
          'Select "Add to Home screen"',
          'Tap "Add" to install the app',
        ],
        features: [
          "Works offline after installation",
          "Appears in app drawer",
          "Push notifications support",
          "Background sync capabilities",
        ],
      }

    case "Windows":
      return {
        install: [
          "Open in Chrome or Edge browser",
          "Look for install button in address bar",
          'Click "Install" when prompted',
          "App will appear in Start Menu",
        ],
        features: [
          "Works offline after installation",
          "Appears in Start Menu and taskbar",
          "Desktop notifications",
          "Keyboard shortcuts support",
        ],
      }

    case "macOS":
      return {
        install: [
          "Open in Chrome or Safari browser",
          "Look for install button in address bar",
          'Click "Install" when prompted',
          "App will appear in Applications folder",
        ],
        features: [
          "Works offline after installation",
          "Appears in Dock and Launchpad",
          "Desktop notifications",
          "Touch Bar support (if available)",
        ],
      }

    default:
      return {
        install: [
          "Open in a modern browser (Chrome, Firefox, Safari, Edge)",
          "Look for install button in address bar",
          'Click "Install" when prompted',
          "App will be available as desktop application",
        ],
        features: [
          "Works offline after installation",
          "Desktop application experience",
          "Fast loading and performance",
          "Cross-platform compatibility",
        ],
      }
  }
}
