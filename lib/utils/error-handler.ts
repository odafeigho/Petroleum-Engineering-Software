export class AppError extends Error {
  constructor(
    message: string,
    public code = "UNKNOWN_ERROR",
    public statusCode = 500,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message, "VALIDATION_ERROR", 400)
    this.name = "ValidationError"
  }
}

export class AuthError extends AppError {
  constructor(message: string) {
    super(message, "AUTH_ERROR", 401)
    this.name = "AuthError"
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, "DATABASE_ERROR", 500)
    this.name = "DatabaseError"
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes("auth")) {
      return new AuthError(error.message)
    }
    if (error.message.includes("validation")) {
      return new ValidationError(error.message)
    }
    if (error.message.includes("database") || error.message.includes("supabase")) {
      return new DatabaseError(error.message)
    }

    return new AppError(error.message)
  }

  return new AppError("An unexpected error occurred")
}

export function logError(error: AppError, context?: Record<string, any>) {
  console.error(`[${error.code}] ${error.message}`, {
    error,
    context,
    timestamp: new Date().toISOString(),
  })

  // In production, you might want to send this to an error tracking service
  // like Sentry, LogRocket, etc.
}
