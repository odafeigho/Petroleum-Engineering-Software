"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth } from "./auth-provider"

export function LoginForm() {
  const { signIn, signUp, loading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await signIn(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in")
    }
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    const fullName = formData.get("fullName") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    try {
      await signUp(email, password, fullName)
      setSuccess("Account created successfully! Please check your email to verify your account.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div
        className="fixed inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/petroleum-bg.jpg')",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Database className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Reservoir Data Harmonizer</h1>
          <p className="text-slate-400">Professional Petroleum Engineering Software</p>
        </div>

        <Card className="petroleum-card">
          <CardHeader>
            <CardTitle className="text-slate-100 text-center">Welcome</CardTitle>
            <CardDescription className="text-slate-400 text-center">
              Sign in to your account or create a new one to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800/30">
                <TabsTrigger value="signin" className="petroleum-tab">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="petroleum-tab">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {error && (
                <Alert className="mt-4 border-red-500/50 bg-red-500/10">
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mt-4 border-green-500/50 bg-green-500/10">
                  <AlertDescription className="text-green-400">{success}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="signin" className="space-y-4 mt-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-slate-200">
                      Email
                    </Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      required
                      className="petroleum-input"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-slate-200">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="petroleum-input pr-10"
                        placeholder="Enter your password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-200"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="petroleum-button w-full">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-slate-200">
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      name="fullName"
                      type="text"
                      required
                      className="petroleum-input"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-slate-200">
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      required
                      className="petroleum-input"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-slate-200">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        className="petroleum-input pr-10"
                        placeholder="Create a password (min 6 characters)"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-200"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password" className="text-slate-200">
                      Confirm Password
                    </Label>
                    <Input
                      id="signup-confirm-password"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      className="petroleum-input"
                      placeholder="Confirm your password"
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="petroleum-button w-full">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-slate-400">
              <p>By signing up, you agree to our terms of service and privacy policy.</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Need help? Contact support at support@reservoir-harmonizer.com</p>
        </div>
      </div>
    </div>
  )
}
