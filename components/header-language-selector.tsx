"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, Globe } from "lucide-react"
import { useI18n } from "../lib/i18n/context"
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "../lib/i18n/types"
import { FlagIcon } from "./flag-icon"

export function HeaderLanguageSelector() {
  const { language, setLanguage } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = SUPPORTED_LANGUAGES.find((lang) => lang.code === language)

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200 gap-2">
          {currentLanguage ? (
            <FlagIcon src={currentLanguage.flag} alt={currentLanguage.name} className="w-4 h-4" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">{currentLanguage?.code.toUpperCase()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 bg-slate-800 border-slate-700" align="end">
        <div className="p-3 border-b border-slate-700">
          <h4 className="font-medium text-slate-200">Select Language</h4>
          <p className="text-xs text-slate-400">Choose your preferred language</p>
        </div>
        <ScrollArea className="h-80">
          <div className="p-2">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <Button
                key={lang.code}
                variant="ghost"
                className={`w-full justify-start gap-3 h-auto p-3 ${
                  language === lang.code
                    ? "bg-slate-700/50 text-slate-200"
                    : "text-slate-300 hover:bg-slate-700/30 hover:text-slate-200"
                }`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <FlagIcon src={lang.flag} alt={lang.name} className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <div className="font-medium">{lang.nativeName}</div>
                  <div className="text-xs text-slate-400">{lang.name}</div>
                </div>
                {language === lang.code && <Check className="h-4 w-4 text-blue-400 flex-shrink-0" />}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
