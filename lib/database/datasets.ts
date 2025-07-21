import { getSupabaseClient } from "./supabase"
import type { Database } from "./supabase"
import type { DataSet } from "../../app/page"

type DatasetRow = Database["public"]["Tables"]["datasets"]["Row"]
type DatasetInsert = Database["public"]["Tables"]["datasets"]["Insert"]
type DatasetUpdate = Database["public"]["Tables"]["datasets"]["Update"]

export class DatasetService {
  private supabase = getSupabaseClient()

  async saveDataset(dataset: DataSet, userId: string, projectId?: string): Promise<string> {
    const datasetData: DatasetInsert = {
      user_id: userId,
      project_id: projectId || null,
      name: dataset.name,
      type: dataset.type,
      data: dataset.data,
      normalized: dataset.normalized ?? false,
      normalization_method: dataset.normalizationMethod ?? null,
      file_name: dataset.fileName ?? null,
      file_size: dataset.fileSize ?? null,
      file_type: dataset.fileType ?? null,
    }

    const { data, error } = await this.supabase.from("datasets").insert(datasetData).select("id").single()

    if (error) throw new Error(`Failed to save dataset: ${error.message}`)

    return data.id
  }

  async updateDataset(id: string, updates: Partial<DataSet>): Promise<void> {
    const patch: DatasetUpdate = {}

    if (updates.name) patch.name = updates.name
    if (updates.data) patch.data = updates.data
    if (updates.normalized !== undefined) patch.normalized = updates.normalized
    if (updates.normalizationMethod) patch.normalization_method = updates.normalizationMethod

    const { error } = await this.supabase.from("datasets").update(patch).eq("id", id)
    if (error) throw new Error(`Failed to update dataset: ${error.message}`)
  }

  async getDatasets(userId: string, projectId?: string): Promise<DataSet[]> {
    let query = this.supabase
      .from("datasets")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (projectId) query = query.eq("project_id", projectId)

    const { data, error } = await query
    if (error) throw new Error(`Failed to fetch datasets: ${error.message}`)

    return data.map(this.mapRowToDataset)
  }

  async getDataset(id: string): Promise<DataSet | null> {
    const { data, error } = await this.supabase.from("datasets").select("*").eq("id", id).single()

    if (error) {
      // PGRST116 = “Results contain 0 rows”
      if (error.code === "PGRST116") return null
      throw new Error(`Failed to fetch dataset: ${error.message}`)
    }

    return this.mapRowToDataset(data)
  }

  async deleteDataset(id: string): Promise<void> {
    const { error } = await this.supabase.from("datasets").delete().eq("id", id)
    if (error) throw new Error(`Failed to delete dataset: ${error.message}`)
  }

  /**
   * Case-insensitive search by name OR type.
   * Uses PostgREST/Supabase wildcard syntax: `*term*`
   * DO NOT add spaces after commas; that triggers the invalid-regex bug.
   */
  async searchDatasets(userId: string, term: string): Promise<DataSet[]> {
    const pattern = `*${term}*`

    const { data, error } = await this.supabase
      .from("datasets")
      .select("*")
      .eq("user_id", userId)
      .or(`name.ilike.${pattern},type.ilike.${pattern}`) // ⚠️ no spaces!
      .order("created_at", { ascending: false })

    if (error) throw new Error(`Failed to search datasets: ${error.message}`)

    return data.map(this.mapRowToDataset)
  }

  /* ---------- helpers ---------- */
  private mapRowToDataset(row: DatasetRow): DataSet {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      data: row.data,
      normalized: row.normalized,
      normalizationMethod: row.normalization_method ?? undefined,
      fileName: row.file_name ?? undefined,
      fileSize: row.file_size ?? undefined,
      fileType: row.file_type ?? undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }
}

export const datasetService = new DatasetService()
