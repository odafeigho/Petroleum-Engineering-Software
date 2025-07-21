"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronDown } from "lucide-react"
import { useI18n } from "../lib/i18n/context"
import type { SupportedLanguage } from "../lib/i18n/types"
import { FlagIcon } from "./flag-icon"

export const languageNames: Record<SupportedLanguage, { name: string; nativeName: string; flag: string }> = {
  en: { name: "English", nativeName: "English", flag: "/flags/us.png" },
  es: { name: "Spanish", nativeName: "Español", flag: "/flags/es.png" },
  fr: { name: "French", nativeName: "Français", flag: "/flags/fr.png" },
  de: { name: "German", nativeName: "Deutsch", flag: "/flags/de.png" },
  zh: { name: "Chinese (Simplified)", nativeName: "简体中文", flag: "/flags/cn.png" },
  ar: { name: "Arabic", nativeName: "العربية", flag: "/flags/sa.jpeg" },
  pt: { name: "Portuguese", nativeName: "Português", flag: "/flags/pt.png" },
  ru: { name: "Russian", nativeName: "Русский", flag: "/flags/ru.png" },
  it: { name: "Italian", nativeName: "Italiano", flag: "/flags/it.png" },
  xh: { name: "Xhosa", nativeName: "isiXhosa", flag: "/flags/za.jpeg" },
  sa: { name: "Sanskrit", nativeName: "संस्कृतम्", flag: "/flags/in.png" },
}

interface LanguageMenuProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  showFullName?: boolean
  showFlag?: boolean
  showIcon?: boolean
  className?: string
}

export function LanguageMenu({
  variant = "outline",
  size = "default",
  showFullName = true,
  showFlag = true,
  showIcon = false,
  className = "",
}: LanguageMenuProps) {
  const { language, setLanguage } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const currentLanguage = languageNames[language]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={`flex items-center gap-2 ${className}`}>
          {showFlag && <FlagIcon src={currentLanguage.flag} alt={`${currentLanguage.name} flag`} size="sm" />}
          {showFullName ? (
            <span>{currentLanguage.nativeName}</span>
          ) : (
            <span className="font-medium">{currentLanguage.name}</span>
          )}
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-0">
        <div className="p-2">
          <DropdownMenuLabel className="flex items-center gap-2 px-2">
            <span className="text-lg">🌍</span>
            Select Language
          </DropdownMenuLabel>
        </div>
        <DropdownMenuSeparator className="mx-2" />
        <ScrollArea className="h-64">
          <div className="p-1">
            {Object.entries(languageNames).map(([code, info]) => (
              <DropdownMenuItem
                key={code}
                onClick={() => {
                  setLanguage(code as SupportedLanguage)
                  setIsOpen(false)
                }}
                className="flex items-center justify-between mx-1 my-0.5"
              >
                <div className="flex items-center gap-3">
                  <FlagIcon src={info.flag} alt={`${info.name} flag`} size="md" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{info.nativeName}</span>
                    <span className="text-xs text-muted-foreground">{info.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {language === code && <Check className="h-4 w-4 text-green-600" />}
                  <Badge variant="outline" className="text-xs">
                    {info.name}
                  </Badge>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
