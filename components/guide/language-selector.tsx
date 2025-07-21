"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronDown } from "lucide-react"
import { useI18n } from "../../lib/i18n/context"
import type { SupportedLanguage } from "../../lib/i18n/types"
import { languageNames } from "../language-menu"
import { FlagIcon } from "../flag-icon"

interface LanguageSelectorProps {
  variant?: "button" | "compact"
  showLabel?: boolean
}

export function LanguageSelector({ variant = "button", showLabel = true }: LanguageSelectorProps) {
  const { language, setLanguage } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languageNames[language]

  if (variant === "compact") {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
            <FlagIcon src={currentLanguage.flag} alt={`${currentLanguage.name} flag`} size="sm" />
            <span className="text-xs font-medium">{currentLanguage.name}</span>
            <ChevronDown className="h-3 w-3 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 p-0">
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
                  <div className="flex items-center gap-2">
                    <FlagIcon src={info.flag} alt={`${info.name} flag`} size="sm" />
                    <span className="text-sm">{info.nativeName}</span>
                  </div>
                  {language === code && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </div>
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FlagIcon src={currentLanguage.flag} alt={`${currentLanguage.name} flag`} size="md" />
          {showLabel && <span>{currentLanguage.nativeName}</span>}
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-0">
        <ScrollArea className="h-72">
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
                  <FlagIcon src={info.flag} alt={`${info.name} flag`} size="lg" />
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
