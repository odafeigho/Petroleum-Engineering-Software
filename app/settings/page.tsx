"use client"

import { I18nProvider } from "../../lib/i18n/context"
import { GuidePage, GuideHeader, GuideSection } from "../../components/guide"
import { NotificationSettings } from "../../components/notification-settings"
import { Settings } from "lucide-react"

export default function SettingsPage() {
  return (
    <I18nProvider defaultLanguage="en">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <GuidePage>
          <GuideHeader
            title="Settings"
            description="Configure your Reservoir Data Harmonizer preferences"
            useTranslations={false}
          />

          <GuideSection
            title="Notification Preferences"
            description="Manage push notifications for data processing updates"
            icon={Settings}
          >
            <NotificationSettings />
          </GuideSection>
        </GuidePage>
      </div>
    </I18nProvider>
  )
}
