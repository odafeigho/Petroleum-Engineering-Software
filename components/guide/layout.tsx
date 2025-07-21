"use client"

import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { useI18n } from "../../lib/i18n/context"
import { LanguageSelector } from "./language-selector"

interface GuidePageProps {
  children: ReactNode
  className?: string
  showLanguageSelector?: boolean
}

export function GuidePage({ children, className = "", showLanguageSelector = true }: GuidePageProps) {
  const { isRTL } = useI18n()

  return (
    <div className={`max-w-6xl mx-auto p-6 space-y-8 ${className} ${isRTL ? "font-arabic" : ""}`}>
      {showLanguageSelector && (
        <div className="flex justify-end">
          <LanguageSelector variant="compact" />
        </div>
      )}
      {children}
    </div>
  )
}

interface GuideHeaderProps {
  title?: string
  description?: string
  useTranslations?: boolean
}

export function GuideHeader({ title, description, useTranslations = true }: GuideHeaderProps) {
  const { t } = useI18n()

  const displayTitle = useTranslations ? t.guide.title : title
  const displayDescription = useTranslations ? t.guide.description : description

  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{displayTitle}</h1>
      {displayDescription && <p className="text-lg text-gray-600 max-w-3xl mx-auto">{displayDescription}</p>}
    </div>
  )
}

interface GuideSectionProps {
  title: string
  description?: string
  icon?: LucideIcon
  children: ReactNode
  className?: string
  id?: string
}

export function GuideSection({ title, description, icon: Icon, children, className = "", id }: GuideSectionProps) {
  return (
    <Card className={className} id={id}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5" />}
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6">{children}</CardContent>
    </Card>
  )
}

interface GuideGridProps {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function GuideGrid({ children, columns = 2, className = "" }: GuideGridProps) {
  const colsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }[columns]

  return <div className={`grid ${colsClass} gap-6 ${className}`}>{children}</div>
}
