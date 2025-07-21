"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { SupportedLanguage } from "./types"
import { en } from "./translations/en"
import { es } from "./translations/es"
import { fr } from "./translations/fr"
import { de } from "./translations/de"
import { zh } from "./translations/zh"
import { ar } from "./translations/ar"
import { pt } from "./translations/pt"
import { ru } from "./translations/ru"
import { it } from "./translations/it"
import { xh } from "./translations/xh"
import { sa } from "./translations/sa"

const translations = {
  en,
  es,
  fr,
  de,
  zh,
  ar,
  pt,
  ru,
  it,
  xh,
  sa,
}

interface I18nContextType {
  language: SupportedLanguage
  setLanguage: (language: SupportedLanguage) => void
  t: any
  isRTL: boolean
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({
  children,
  defaultLanguage = "en",
}: {
  children: React.ReactNode
  defaultLanguage?: SupportedLanguage
}) {
  const [language, setLanguage] = useState<SupportedLanguage>(defaultLanguage)
  const [isRTL, setIsRTL] = useState(false)

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem("preferred-language") as SupportedLanguage
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }

    // Set RTL for Arabic
    setIsRTL(language === "ar")

    // Apply RTL to document
    if (typeof document !== "undefined") {
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
      document.documentElement.lang = language
    }
  }, [language])

  const handleSetLanguage = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage)
    localStorage.setItem("preferred-language", newLanguage)
    setIsRTL(newLanguage === "ar")

    // Apply RTL to document
    if (typeof document !== "undefined") {
      document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr"
      document.documentElement.lang = newLanguage
    }
  }

  const t = translations[language] || translations.en

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
        isRTL,
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
