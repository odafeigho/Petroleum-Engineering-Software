import { z } from "zod"

export const datasetSchema = z.object({
  name: z.string().min(1, "Dataset name is required").max(100, "Dataset name too long"),
  type: z.enum(["logs", "seismic", "production", "core"], {
    errorMap: () => ({ message: "Invalid dataset type" }),
  }),
  data: z.array(z.record(z.any())).min(1, "Dataset must contain at least one record"),
  fileName: z.string().optional(),
  fileSize: z.number().positive().optional(),
  fileType: z.string().optional(),
})

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100, "Project name too long"),
  description: z.string().max(500, "Description too long").optional(),
})

export const userProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100, "Name too long"),
  company: z.string().max(100, "Company name too long").optional(),
  role: z.string().max(50, "Role too long").optional(),
  preferences: z.record(z.any()).optional(),
})

export const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export type DatasetInput = z.infer<typeof datasetSchema>
export type ProjectInput = z.infer<typeof projectSchema>
export type UserProfileInput = z.infer<typeof userProfileSchema>
export type AuthInput = z.infer<typeof authSchema>
