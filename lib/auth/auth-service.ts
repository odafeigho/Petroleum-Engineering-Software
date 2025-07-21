import { getSupabaseClient } from "../database/supabase"
import type { User, Session } from "@supabase/supabase-js"

export interface UserProfile {
  id: string
  email: string
  fullName?: string
  company?: string
  role?: string
  preferences: any
}

export class AuthService {
  private supabase = getSupabaseClient()

  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut()
    if (error) {
      throw new Error(error.message)
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    return user
  }

  async getCurrentSession(): Promise<Session | null> {
    const {
      data: { session },
    } = await this.supabase.auth.getSession()
    return session
  }

  async updateProfile(updates: Partial<UserProfile>) {
    const user = await this.getCurrentUser()
    if (!user) throw new Error("No authenticated user")

    const { error } = await this.supabase.from("user_profiles").upsert({
      id: user.id,
      email: user.email || "",
      full_name: updates.fullName,
      company: updates.company,
      role: updates.role,
      preferences: updates.preferences || {},
    })

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`)
    }
  }

  async getProfile(): Promise<UserProfile | null> {
    const user = await this.getCurrentUser()
    if (!user) return null

    const { data, error } = await this.supabase.from("user_profiles").select("*").eq("id", user.id).single()

    if (error) {
      if (error.code === "PGRST116") {
        // Profile doesn't exist, create it
        await this.updateProfile({
          id: user.id,
          email: user.email || "",
          preferences: {},
        })
        return {
          id: user.id,
          email: user.email || "",
          preferences: {},
        }
      }
      throw new Error(`Failed to fetch profile: ${error.message}`)
    }

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name || undefined,
      company: data.company || undefined,
      role: data.role || undefined,
      preferences: data.preferences || {},
    }
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }
}

export const authService = new AuthService()
