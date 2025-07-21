"use client"

import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Info } from "lucide-react"

interface GlossaryItemProps {
  term: string
  definition: string
  color?: "blue" | "green" | "orange" | "purple" | "red" | "teal" | "indigo" | "pink" | "yellow"
}

export function GlossaryItem({ term, definition, color = "blue" }: GlossaryItemProps) {
  return (
    <div className={`border-l-4 border-${color}-500 pl-3`}>
      <h4 className="font-semibold">{term}</h4>
      <p className="text-sm text-muted-foreground">{definition}</p>
    </div>
  )
}

interface FaqItemProps {
  question: string
  answer: ReactNode
}

export function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-semibold text-blue-600 mb-2">{question}</h4>
      <div className="text-sm text-muted-foreground">{answer}</div>
    </div>
  )
}

interface StepItemProps {
  number: number
  title: string
  description: string
  color?: string
}

export function StepItem({ number, title, description, color = "blue" }: StepItemProps) {
  return (
    <div className="flex gap-3">
      <div
        className={`flex-shrink-0 w-6 h-6 bg-${color}-100 text-${color}-600 rounded-full flex items-center justify-center text-sm font-semibold`}
      >
        {number}
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

interface DataTypeItemProps {
  label: string
  description: string
}

export function DataTypeItem({ label, description }: DataTypeItemProps) {
  return (
    <div className="flex items-center gap-2 p-2 border rounded">
      <Badge variant="outline">{label}</Badge>
      <span className="text-sm">{description}</span>
    </div>
  )
}

type AlertType = "info" | "warning" | "success" | "error"

interface AlertBoxProps {
  type: AlertType
  title: string
  children: ReactNode
}

export function AlertBox({ type, title, children }: AlertBoxProps) {
  const styles = {
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      title: "text-blue-800",
      text: "text-blue-700",
      icon: <Info className="h-5 w-5 text-blue-600 mt-0.5" />,
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      title: "text-yellow-800",
      text: "text-yellow-700",
      icon: <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />,
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      title: "text-green-800",
      text: "text-green-700",
      icon: <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />,
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      title: "text-red-800",
      text: "text-red-700",
      icon: <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />,
    },
  }

  const style = styles[type]

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4`}>
      <div className="flex items-start gap-2">
        {style.icon}
        <div>
          <h4 className={`font-semibold ${style.title}`}>{title}</h4>
          <div className={`text-sm ${style.text} mt-1`}>{children}</div>
        </div>
      </div>
    </div>
  )
}

interface FormulaBoxProps {
  formula: ReactNode
  description?: string
}

export function FormulaBox({ formula, description }: FormulaBoxProps) {
  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
      <div className="bg-white rounded border p-3 text-center mb-2">
        <code className="text-lg">{formula}</code>
      </div>
      {description && <p className="text-sm text-indigo-700">{description}</p>}
    </div>
  )
}

interface TroubleshootingItemProps {
  problem: string
  cause: string
  solution: string
  severity: "error" | "warning" | "info"
}

export function TroubleshootingItem({ problem, cause, solution, severity }: TroubleshootingItemProps) {
  const icon = {
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  }[severity]

  const textColor = {
    error: "text-red-600",
    warning: "text-orange-600",
    info: "text-blue-600",
  }[severity]

  return (
    <div className="border rounded-lg p-4">
      <h4 className={`font-semibold ${textColor} mb-2`}>
        {icon} {problem}
      </h4>
      <p className="text-sm text-muted-foreground mb-2">
        <strong>Cause:</strong> {cause}
      </p>
      <p className="text-sm">
        <strong>Solution:</strong> {solution}
      </p>
    </div>
  )
}
