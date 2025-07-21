"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Database,
  FolderOpen,
  Upload,
  TrendingUp,
  BarChart3,
  Settings,
  User,
  LogOut,
  Plus,
  Activity,
} from "lucide-react"
import { ProjectManager } from "../../components/projects/project-manager"
import { DatasetLibrary } from "../../components/datasets/dataset-library"
import { useAuth } from "../../components/auth/auth-provider"
import { useI18n } from "../../lib/i18n/context"
import { projectService, type Project } from "../../lib/database/projects"
import { datasetService } from "../../lib/database/datasets"
import type { DataSet } from "../page"

export default function DashboardPage() {
  const { user, profile, signOut } = useAuth()
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalDatasets: 0,
    normalizedDatasets: 0,
    totalRecords: 0,
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Load projects and datasets
      const [projects, datasets] = await Promise.all([
        projectService.getProjects(user.id),
        datasetService.getDatasets(user.id),
      ])

      // Calculate stats
      const normalizedCount = datasets.filter((d) => d.normalized).length
      const totalRecords = datasets.reduce((sum, d) => sum + d.data.length, 0)

      setStats({
        totalProjects: projects.length,
        totalDatasets: datasets.length,
        normalizedDatasets: normalizedCount,
        totalRecords,
      })

      // Generate recent activity (mock data for now)
      const activity = [
        {
          id: 1,
          type: "dataset_uploaded",
          message: "New dataset uploaded: Production Data Q4",
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        },
        {
          id: 2,
          type: "normalization_completed",
          message: "Normalization completed for Seismic Survey 2024",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        },
        {
          id: 3,
          type: "project_created",
          message: "New project created: North Sea Analysis",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        },
      ]

      setRecentActivity(activity)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project)
    setActiveTab("datasets")
  }

  const handleDatasetLoad = (datasets: DataSet[]) => {
    // Navigate to main app with loaded datasets
    const params = new URLSearchParams()
    params.set("datasets", JSON.stringify(datasets.map((d) => d.id)))
    window.location.href = `/?${params.toString()}`
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "dataset_uploaded":
        return <Upload className="h-4 w-4 text-blue-400" />
      case "normalization_completed":
        return <TrendingUp className="h-4 w-4 text-green-400" />
      case "project_created":
        return <FolderOpen className="h-4 w-4 text-purple-400" />
      default:
        return <Activity className="h-4 w-4 text-slate-400" />
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-slate-400">Loading dashboard...</div>
      </div>
    )
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
                <h1 className="text-xl font-bold text-slate-100">Dashboard</h1>
                <p className="text-sm text-slate-400">Welcome back, {profile?.fullName || user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-slate-200"
                onClick={() => (window.location.href = "/")}
              >
                <Database className="h-4 w-4 mr-2" />
                Harmonizer
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-slate-200"
                onClick={() => (window.location.href = "/settings")}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/30 p-1 rounded-lg max-w-2xl">
            <TabsTrigger value="overview" className="petroleum-tab flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="petroleum-tab flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="datasets" className="petroleum-tab flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Datasets</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="petroleum-tab flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="petroleum-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Total Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-400">{stats.totalProjects}</div>
                  </CardContent>
                </Card>

                <Card className="petroleum-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Total Datasets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-cyan-400">{stats.totalDatasets}</div>
                  </CardContent>
                </Card>

                <Card className="petroleum-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Normalized</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-400">{stats.normalizedDatasets}</div>
                  </CardContent>
                </Card>

                <Card className="petroleum-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Total Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-400">{stats.totalRecords.toLocaleString()}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="petroleum-card">
                <CardHeader>
                  <CardTitle className="text-slate-100">Quick Actions</CardTitle>
                  <CardDescription className="text-slate-400">Get started with common tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      className="petroleum-button h-auto p-4 flex flex-col items-center gap-2"
                      onClick={() => setActiveTab("projects")}
                    >
                      <Plus className="h-6 w-6" />
                      <span>New Project</span>
                    </Button>
                    <Button
                      className="petroleum-button h-auto p-4 flex flex-col items-center gap-2"
                      onClick={() => (window.location.href = "/?tab=upload")}
                    >
                      <Upload className="h-6 w-6" />
                      <span>Upload Data</span>
                    </Button>
                    <Button
                      className="petroleum-button h-auto p-4 flex flex-col items-center gap-2"
                      onClick={() => (window.location.href = "/")}
                    >
                      <Database className="h-6 w-6" />
                      <span>Harmonizer</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="petroleum-card">
                <CardHeader>
                  <CardTitle className="text-slate-100">Recent Activity</CardTitle>
                  <CardDescription className="text-slate-400">Your latest actions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentActivity.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No recent activity</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                          {getActivityIcon(activity.type)}
                          <div className="flex-1">
                            <p className="text-sm text-slate-200">{activity.message}</p>
                            <p className="text-xs text-slate-400">{formatTimeAgo(activity.timestamp)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <ProjectManager onProjectSelect={handleProjectSelect} selectedProjectId={selectedProject?.id} />
            </TabsContent>

            <TabsContent value="datasets" className="space-y-6">
              <DatasetLibrary
                onDatasetLoad={handleDatasetLoad}
                projectId={selectedProject?.id}
                onDatasetSelect={(dataset) => {
                  // Navigate to harmonizer with selected dataset
                  window.location.href = `/?dataset=${dataset.id}`
                }}
              />
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card className="petroleum-card">
                <CardHeader>
                  <CardTitle className="text-slate-100">Profile Information</CardTitle>
                  <CardDescription className="text-slate-400">Manage your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-200">Email</label>
                      <p className="text-slate-400">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-200">Full Name</label>
                      <p className="text-slate-400">{profile?.fullName || "Not set"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-200">Company</label>
                      <p className="text-slate-400">{profile?.company || "Not set"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-200">Role</label>
                      <p className="text-slate-400">{profile?.role || "Not set"}</p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button className="petroleum-button" onClick={() => (window.location.href = "/settings")}>
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}
