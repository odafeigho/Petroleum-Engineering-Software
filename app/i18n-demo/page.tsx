"use client"

import { I18nProvider } from "../../lib/i18n/context"
import { GuidePage, GuideSection, GuideGrid, AlertBox } from "../../components/guide"
import { LanguageSelector } from "../../components/guide/language-selector"
import { useI18n } from "../../lib/i18n/context"
import { Globe, Users, Zap, Flag } from "lucide-react"

function I18nDemoContent() {
  const { t, language, isRTL } = useI18n()

  return (
    <GuidePage showLanguageSelector={false}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Internationalization Demo</h1>
          <p className="text-lg text-gray-600">
            Experience the Reservoir Data Harmonizer guide in multiple languages with country flags
          </p>
        </div>
        <LanguageSelector />
      </div>

      <GuideGrid columns={4}>
        <div className="text-center p-6 border rounded-lg bg-blue-50">
          <Flag className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h3 className="font-semibold text-lg mb-2">9 Languages</h3>
          <p className="text-sm text-muted-foreground">
            Support for English, Spanish, French, German, Chinese, Arabic, Portuguese, Russian, and Italian with country
            flags
          </p>
        </div>

        <div className="text-center p-6 border rounded-lg bg-green-50">
          <Users className="h-12 w-12 mx-auto mb-4 text-green-600" />
          <h3 className="font-semibold text-lg mb-2">Global Accessibility</h3>
          <p className="text-sm text-muted-foreground">
            RTL support for Arabic and proper typography for all supported languages
          </p>
        </div>

        <div className="text-center p-6 border rounded-lg bg-purple-50">
          <Zap className="h-12 w-12 mx-auto mb-4 text-purple-600" />
          <h3 className="font-semibold text-lg mb-2">Dynamic Switching</h3>
          <p className="text-sm text-muted-foreground">Switch languages instantly with persistent preferences</p>
        </div>

        <div className="text-center p-6 border rounded-lg bg-orange-50">
          <Globe className="h-12 w-12 mx-auto mb-4 text-orange-600" />
          <h3 className="font-semibold text-lg mb-2">Visual Recognition</h3>
          <p className="text-sm text-muted-foreground">
            Country flags make language selection intuitive and culturally relevant
          </p>
        </div>
      </GuideGrid>

      <GuideSection title="Current Language Demo" icon={Flag}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Language Info</h4>
              <ul className="text-sm space-y-1">
                <li>
                  <strong>Current Language:</strong> {language.toUpperCase()}
                </li>
                <li>
                  <strong>Text Direction:</strong> {isRTL ? "Right-to-Left (RTL)" : "Left-to-Right (LTR)"}
                </li>
                <li>
                  <strong>Guide Title:</strong> {t.guide.title}
                </li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Sample Content</h4>
              <div className="text-sm space-y-2">
                <p>
                  <strong>Upload:</strong> {t.guide.upload.title}
                </p>
                <p>
                  <strong>FAQ:</strong> {t.guide.faq.title}
                </p>
                <p>
                  <strong>Glossary:</strong> {t.guide.glossary.title}
                </p>
              </div>
            </div>
          </div>

          <AlertBox type="info" title={t.guide.upload.exampleWorkflow.title}>
            <p>{t.guide.upload.exampleWorkflow.description}</p>
          </AlertBox>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Technical Terms Example</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <strong>{t.guide.glossary.reservoirTerms.porosity.term}:</strong>
                </p>
                <p className="text-muted-foreground">{t.guide.glossary.reservoirTerms.porosity.definition}</p>
              </div>
              <div>
                <p>
                  <strong>{t.guide.glossary.dataScienceTerms.normalization.term}:</strong>
                </p>
                <p className="text-muted-foreground">{t.guide.glossary.dataScienceTerms.normalization.definition}</p>
              </div>
            </div>
          </div>
        </div>
      </GuideSection>

      <GuideSection title="Flag-Based Language Selection" icon={Flag}>
        <GuideGrid>
          <div className="space-y-3">
            <h4 className="font-semibold">Visual Benefits</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Instant visual recognition of languages</li>
              <li>• Cultural representation through flags</li>
              <li>• Reduced cognitive load for selection</li>
              <li>• Universal symbol understanding</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Supported Countries</h4>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-sm">🇺🇸 English</span>
              <span className="inline-flex items-center gap-1 text-sm">🇪🇸 Español</span>
              <span className="inline-flex items-center gap-1 text-sm">🇫🇷 Français</span>
              <span className="inline-flex items-center gap-1 text-sm">🇩🇪 Deutsch</span>
              <span className="inline-flex items-center gap-1 text-sm">🇨🇳 中文</span>
              <span className="inline-flex items-center gap-1 text-sm">🇸🇦 العربية</span>
              <span className="inline-flex items-center gap-1 text-sm">🇵🇹 Português</span>
              <span className="inline-flex items-center gap-1 text-sm">🇷🇺 Русский</span>
              <span className="inline-flex items-center gap-1 text-sm">🇮🇹 Italiano</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">User Experience</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Instant language switching</li>
              <li>• Persistent language preferences</li>
              <li>• Native language names in selector</li>
              <li>• Proper typography for each language</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Accessibility</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Screen reader compatible</li>
              <li>• Keyboard navigation support</li>
              <li>• High contrast support</li>
              <li>• Proper ARIA labels</li>
            </ul>
          </div>
        </GuideGrid>
      </GuideSection>
    </GuidePage>
  )
}

export default function I18nDemoPage() {
  return (
    <I18nProvider defaultLanguage="en">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <I18nDemoContent />
      </div>
    </I18nProvider>
  )
}
