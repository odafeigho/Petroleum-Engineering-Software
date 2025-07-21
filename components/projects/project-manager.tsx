"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, FolderOpen, Calendar, Database, Trash2, Archive, Edit } from "lucide-react"
import { projectService, type Project } from "../../lib/database/projects"
import { useAuth } from "../auth/auth-provider"

interface ProjectManagerProps {
  onProjectSelect?: (project: Project) => void
  selectedProjectId?: string
}

export function ProjectManager({ onProjectSelect, selectedProjectId }: ProjectManagerProps) {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  useEffect(() => {
    if (user) {
      loadProjects()
    }
  }, [user])

  const loadProjects = async () => {
    if (!user) return

    try {
      setLoading(true)
      const data = await projectService.getProjects(user.id)
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    try {
      await projectService.createProject(name, description, user.id)
      setShowCreateDialog(false)
      await loadProjects()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project")
    }
  }

  const handleUpdateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingProject) return

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    try {
      await projectService.updateProject(editingProject.id, { name, description })
      setEditingProject(null)
      await loadProjects()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project")
    }
  }

  const handleArchiveProject = async (project: Project) => {
    try {
      await projectService.archiveProject(project.id)
      await loadProjects()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive project")
    }
  }

  const handleDeleteProject = async (project: Project) => {
    if (!confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      await projectService.deleteProject(project.id)
      await loadProjects()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project")
    }
  }

  if (loading) {
    return (
      <Card className="petroleum-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-slate-400">Loading projects...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Projects</h2>
          <p className="text-slate-400">Manage your data harmonization projects</p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="petroleum-button">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="petroleum-card border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-slate-100">Create New Project</DialogTitle>
              <DialogDescription className="text-slate-400">
                Create a new project to organize your datasets and processing workflows.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-200">
                  Project Name
                </Label>
                <Input id="name" name="name" required className="petroleum-input" placeholder="Enter project name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-200">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  className="petroleum-input"
                  placeholder="Enter project description (optional)"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowCreateDialog(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </Button>
                <Button type="submit" className="petroleum-button">
                  Create Project
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert className="border-red-500/50 bg-red-500/10">
          <AlertDescription className="text-red-400">{error}</AlertDescription>
        </Alert>
      )}

      {projects.length === 0 ? (
        <Card className="petroleum-card">
          <CardContent className="p-12 text-center">
            <FolderOpen className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-300 mb-2">No Projects Yet</h3>
            <p className="text-slate-400 mb-4">
              Create your first project to start organizing your data harmonization workflows.
            </p>
            <Button onClick={() => setShowCreateDialog(true)} className="petroleum-button">
              <Plus className="mr-2 h-4 w-4" />
              Create First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className={`petroleum-card cursor-pointer transition-all hover:scale-105 ${
                selectedProjectId === project.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => onProjectSelect?.(project)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-slate-100 text-lg">{project.name}</CardTitle>
                    {project.description && (
                      <CardDescription className="text-slate-400 mt-1">{project.description}</CardDescription>
                    )}
                  </div>

                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingProject(project)
                      }}
                      className="text-slate-400 hover:text-slate-200 h-8 w-8 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleArchiveProject(project)
                      }}
                      className="text-slate-400 hover:text-yellow-400 h-8 w-8 p-0"
                    >
                      <Archive className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteProject(project)
                      }}
                      className="text-slate-400 hover:text-red-400 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Database className="h-4 w-4" />
                    <span>{project.datasetCount || 0} datasets</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                    {project.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Project Dialog */}
      <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
        <DialogContent className="petroleum-card border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Edit Project</DialogTitle>
            <DialogDescription className="text-slate-400">Update your project details.</DialogDescription>
          </DialogHeader>

          {editingProject && (
            <form onSubmit={handleUpdateProject} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-slate-200">
                  Project Name
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editingProject.name}
                  required
                  className="petroleum-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-slate-200">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={editingProject.description || ""}
                  className="petroleum-input"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditingProject(null)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </Button>
                <Button type="submit" className="petroleum-button">
                  Update Project
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
