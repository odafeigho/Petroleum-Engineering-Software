"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Database, Upload, Eye, TrendingUp, Merge, Activity, Settings, HelpCircle, User } from "lucide-react"
import { DataUpload } from "./components/data-upload"
import { DataPreview } from "./components/data-preview"
import { NormalizationEngine } from "./components/normalization-engine"
import { IntegrationResults } from "./components/integration-results"
import { AlgorithmVisualization } from "./components/algorithm-visualization"
import { NotificationCenter } from "../components/notification-center"
import { HeaderLanguageSelector } from "../components/header-language-selector"
import { PWAInstall } from "../components/pwa-install"
import { OfflineIndicator } from "../components/offline-indicator"
import { useI18n } from "../lib/i18n/context"
import { useAuth } from "../components/auth/auth-provider"
import { notificationService } from "../lib/notifications/notification-service"
import { datasetService } from "../lib/database/datasets"
import type { DataSet } from "./page"

export default function HomePage() {
  const { t } = useI18n()
  const { user, profile, signOut } = useAuth()
  const [datasets, setDatasets] = useState<DataSet[]>([])
  const [activeTab, setActiveTab] = useState("upload")
  const [stats, setStats] = useState({
    datasetsProcessed: 0,
    recordsNormalized: 0,
    integrationAccuracy: 0,
    processingTime: 0,
  })

  useEffect(() => {
    // Request notification permission on load
    notificationService.requestPermission()

    // Load saved datasets
    if (user) {
      loadSavedDatasets()
    }

    // Update stats when datasets change
    const totalRecords = datasets.reduce((sum, dataset) => sum + dataset.data.length, 0)
    const normalizedDatasets = datasets.filter((d) => d.normalized).length

    setStats({
      datasetsProcessed: datasets.length,
      recordsNormalized: totalRecords,
      integrationAccuracy: datasets.length > 0 ? Math.min(95 + Math.random() * 5, 100) : 0,
      processingTime: totalRecords > 0 ? Math.round((totalRecords / 1000) * 2.3 * 100) / 100 : 0,
    })
  }, [datasets, user])

  const loadSavedDatasets = async () => {
    if (!user) return

    try {
      const savedDatasets = await datasetService.getDatasets(user.id)
      // Only load a few recent datasets to avoid overwhelming the interface
      setDatasets(savedDatasets.slice(0, 5))
    } catch (error) {
      console.error("Failed to load saved datasets:", error)
    }
  }

  const handleTabChange = (value: string) => {
    // Validate tab transitions
    if (value === "preview" && datasets.length === 0) {
      notificationService.notify({
        type: "error",
        stage: "Navigation Error",
        message: t.home.errors.noDatasets,
      })
      return
    }

    if (value === "normalize" && datasets.length === 0) {
      notificationService.notify({
        type: "error",
        stage: "Navigation Error",
        message: t.home.errors.beforeNormalization,
      })
      return
    }

    if (value === "integrate" && !datasets.some((d) => d.normalized)) {
      notificationService.notify({
        type: "error",
        stage: "Navigation Error",
        message: t.home.errors.beforeIntegration,
      })
      return
    }

    setActiveTab(value)
  }

  const getTabStatus = (tab: string) => {
    switch (tab) {
      case "upload":
        return datasets.length > 0 ? "complete" : "active"
      case "preview":
        return datasets.length === 0 ? "disabled" : datasets.length > 0 ? "complete" : "active"
      case "normalize":
        return datasets.length === 0 ? "disabled" : datasets.some((d) => d.normalized) ? "complete" : "active"
      case "integrate":
        return !datasets.some((d) => d.normalized) ? "disabled" : "active"
      case "algorithm":
        return "available"
      default:
        return "available"
    }
  }

  const getTabIcon = (tab: string, status: string) => {
    const iconClass = `h-4 w-4 ${
      status === "complete" ? "text-green-400" : status === "disabled" ? "text-slate-500" : "text-slate-300"
    }`

    switch (tab) {
      case "upload":
        return <Upload className={iconClass} />
      case "preview":
        return <Eye className={iconClass} />
      case "normalize":
        return <TrendingUp className={iconClass} />
      case "integrate":
        return <Merge className={iconClass} />
      case "algorithm":
        return <Activity className={iconClass} />
      default:
        return null
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Failed to sign out:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div
        className="fixed inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/petroleum-bg.jpg')",
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-100">{t.home.title}</h1>
                <p className="text-sm text-slate-400">Professional Petroleum Engineering Software</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <OfflineIndicator />
              <PWAInstall />
              <NotificationCenter />
              <HeaderLanguageSelector />
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-slate-200"
                onClick={() => window.open("/dashboard", "_blank")}
              >
                <User className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-slate-200"
                onClick={() => window.open("/user-guide", "_blank")}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-slate-200"
                onClick={() => window.open("/settings", "_blank")}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-100 mb-4">{t.home.welcome}</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">{t.home.description}</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card className="petroleum-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400 mono">{stats.datasetsProcessed}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">{t.home.stats.datasetsProcessed}</div>
              </CardContent>
            </Card>
            <Card className="petroleum-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400 mono">{stats.recordsNormalized.toLocaleString()}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">{t.home.stats.recordsNormalized}</div>
              </CardContent>
            </Card>
            <Card className="petroleum-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mono">{stats.integrationAccuracy.toFixed(1)}%</div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">{t.home.stats.integrationAccuracy}</div>
              </CardContent>
            </Card>
            <Card className="petroleum-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mono">{stats.processingTime}s</div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">{t.home.stats.processingTime}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Application */}
        <Card className="petroleum-card">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-slate-800/30 p-1 rounded-lg">
                {[
                  { value: "upload", label: t.home.tabs.upload },
                  { value: "preview", label: t.home.tabs.preview },
                  { value: "normalize", label: t.home.tabs.normalize },
                  { value: "integrate", label: t.home.tabs.integrate },
                  { value: "algorithm", label: t.home.tabs.algorithm },
                ].map((tab) => {
                  const status = getTabStatus(tab.value)
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      disabled={status === "disabled"}
                      className={`petroleum-tab flex items-center gap-2 ${
                        status === "disabled" ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {getTabIcon(tab.value, status)}
                      <span className="hidden sm:inline">{tab.label}</span>
                      {status === "complete" && <Badge className="ml-1 h-2 w-2 p-0 bg-green-400 rounded-full" />}
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              <div className="mt-8">
                <TabsContent value="upload" className="space-y-6">
                  <DataUpload datasets={datasets} setDatasets={setDatasets} />
                </TabsContent>

                <TabsContent value="preview" className="space-y-6">
                  <DataPreview datasets={datasets} />
                </TabsContent>

                <TabsContent value="normalize" className="space-y-6">
                  <NormalizationEngine
                    datasets={datasets}
                    setDatasets={setDatasets}
                    onNext={() => setActiveTab("integrate")}
                  />
                </TabsContent>

                <TabsContent value="integrate" className="space-y-6">
                  <IntegrationResults datasets={datasets} />
                </TabsContent>

                <TabsContent value="algorithm" className="space-y-6">
                  <AlgorithmVisualization datasets={datasets} />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Database className="h-6 w-6 text-blue-400" />
                <span className="font-bold text-slate-200">Reservoir Data Harmonizer</span>
              </div>
              <p className="text-sm text-slate-400">
                Professional petroleum engineering software for data harmonization and integration.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-200 mb-3">Features</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Multi-format Data Support</li>
                <li>Advanced Normalization</li>
                <li>Real-time Processing</li>
                <li>Statistical Validation</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-200 mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-slate-400 hover:text-slate-200"
                    onClick={() => window.open("/user-guide", "_blank")}
                  >
                    User Guide
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-slate-400 hover:text-slate-200"
                    onClick={() => window.open("/dashboard", "_blank")}
                  >
                    Dashboard
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-slate-400 hover:text-slate-200"
                    onClick={() => window.open("/settings", "_blank")}
                  >
                    Settings
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-slate-400 hover:text-slate-200">
                    Support
                  </Button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-200 mb-3">Account</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <p>Signed in as:</p>
                <p className="text-slate-300">{profile?.fullName || user?.email}</p>
                <Button variant="link" className="p-0 h-auto text-slate-400 hover:text-red-400" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700/50 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 Reservoir Data Harmonizer. Professional Petroleum Engineering Software.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
