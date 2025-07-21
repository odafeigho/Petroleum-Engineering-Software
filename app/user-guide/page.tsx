"use client"

import { I18nProvider } from "../../lib/i18n/context"
import { UserGuide } from "../../components/user-guide"

export default function UserGuidePage() {
  return (
    <I18nProvider defaultLanguage="en">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <UserGuide />
      </div>
    </I18nProvider>
  )
}
