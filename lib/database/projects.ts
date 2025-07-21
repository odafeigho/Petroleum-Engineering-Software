import { getSupabaseClient } from "./supabase"
import type { Database } from "./supabase"

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"]
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"]
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"]

export interface Project {
  id: string
  name: string
  description?: string
  status: "active" | "archived" | "deleted"
  metadata: any
  createdAt: string
  updatedAt: string
  datasetCount?: number
}

export class ProjectService {
  private supabase = getSupabaseClient()

  async createProject(name: string, description: string, userId: string): Promise<string> {
    const projectData: ProjectInsert = {
      user_id: userId,
      name,
      description,
      status: "active",
      metadata: {},
    }

    const { data, error } = await this.supabase.from("projects").insert(projectData).select("id").single()

    if (error) {
      throw new Error(`Failed to create project: ${error.message}`)
    }

    return data.id
  }

  async getProjects(userId: string): Promise<Project[]> {
    const { data, error } = await this.supabase
      .from("projects")
      .select(`
        *,
        datasets(count)
      `)
      .eq("user_id", userId)
      .eq("status", "active")
      .order("updated_at", { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`)
    }

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description || undefined,
      status: row.status as "active" | "archived" | "deleted",
      metadata: row.metadata,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      datasetCount: Array.isArray(row.datasets) ? row.datasets.length : 0,
    }))
  }

  async getProject(id: string): Promise<Project | null> {
    const { data, error } = await this.supabase
      .from("projects")
      .select(`
        *,
        datasets(count)
      `)
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") return null
      throw new Error(`Failed to fetch project: ${error.message}`)
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      status: data.status as "active" | "archived" | "deleted",
      metadata: data.metadata,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      datasetCount: Array.isArray(data.datasets) ? data.datasets.length : 0,
    }
  }

  async updateProject(id: string, updates: Partial<Pick<Project, "name" | "description" | "status">>): Promise<void> {
    const updateData: ProjectUpdate = {}

    if (updates.name) updateData.name = updates.name
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.status) updateData.status = updates.status

    const { error } = await this.supabase.from("projects").update(updateData).eq("id", id)

    if (error) {
      throw new Error(`Failed to update project: ${error.message}`)
    }
  }

  async deleteProject(id: string): Promise<void> {
    const { error } = await this.supabase.from("projects").update({ status: "deleted" }).eq("id", id)

    if (error) {
      throw new Error(`Failed to delete project: ${error.message}`)
    }
  }

  async archiveProject(id: string): Promise<void> {
    const { error } = await this.supabase.from("projects").update({ status: "archived" }).eq("id", id)

    if (error) {
      throw new Error(`Failed to archive project: ${error.message}`)
    }
  }
}

export const projectService = new ProjectService()
