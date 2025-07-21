"use client"

import { I18nProvider } from "../../lib/i18n/context"
import {
  GuidePage,
  GuideHeader,
  GuideSection,
  GuideGrid,
  AlertBox,
  FaqItem,
  GlossaryItem,
  StepItem,
  DataTypeItem,
  FormulaBox,
  TroubleshootingItem,
  FeatureCard,
  ExpandableSection,
  TableOfContents,
} from "../../components/guide"

import { BookOpen, Info, AlertTriangle, Upload, Eye, TrendingUp, Database } from "lucide-react"

export default function GuideComponentsPage() {
  return (
    <I18nProvider defaultLanguage="en">
      <GuidePage>
        <GuideHeader
          title="Guide Component Library"
          description="Showcase of all available guide components for the Reservoir Data Harmonizer"
          useTranslations={false}
        />

        <GuideGrid columns={1}>
          <TableOfContents
            items={[
              { id: "layout", title: "Layout Components" },
              { id: "content", title: "Content Components" },
              { id: "interactive", title: "Interactive Components" },
              { id: "alerts", title: "Alert Components" },
            ]}
            activeId="layout"
          />

          <GuideSection
            title="Layout Components"
            description="Components for structuring guide content"
            icon={BookOpen}
            className="mt-6"
            id="layout"
          >
            <h3 className="font-semibold mb-4">GuideGrid</h3>
            <GuideGrid>
              <div className="border p-4 rounded">Column 1</div>
              <div className="border p-4 rounded">Column 2</div>
            </GuideGrid>

            <h3 className="font-semibold mb-4 mt-6">GuideGrid with 3 columns</h3>
            <GuideGrid columns={3}>
              <div className="border p-4 rounded">Column 1</div>
              <div className="border p-4 rounded">Column 2</div>
              <div className="border p-4 rounded">Column 3</div>
            </GuideGrid>

            <h3 className="font-semibold mb-4 mt-6">GuideGrid with 4 columns</h3>
            <GuideGrid columns={4}>
              <div className="border p-4 rounded">Column 1</div>
              <div className="border p-4 rounded">Column 2</div>
              <div className="border p-4 rounded">Column 3</div>
              <div className="border p-4 rounded">Column 4</div>
            </GuideGrid>
          </GuideSection>

          <GuideSection
            title="Content Components"
            description="Components for displaying different types of content"
            icon={Info}
            className="mt-6"
            id="content"
          >
            <h3 className="font-semibold mb-4">GlossaryItem</h3>
            <GuideGrid>
              <GlossaryItem
                term="Porosity"
                definition="The percentage of void space in rock that can contain fluids."
                color="blue"
              />
              <GlossaryItem
                term="Permeability"
                definition="A measure of rock's ability to transmit fluids."
                color="green"
              />
            </GuideGrid>

            <h3 className="font-semibold mb-4 mt-6">FaqItem</h3>
            <FaqItem
              question="Q: What types of reservoir data can I harmonize?"
              answer={
                <p>
                  <strong>A:</strong> The app supports four main types of reservoir data: Well Logs, Seismic Data,
                  Production Data, and Core Analysis.
                </p>
              }
            />

            <h3 className="font-semibold mb-4 mt-6">StepItem</h3>
            <div className="space-y-3">
              <StepItem
                number={1}
                title="Enter Dataset Name"
                description="Choose a descriptive name for your dataset"
              />
              <StepItem
                number={2}
                title="Select Data Type"
                description="Choose the appropriate category for your data"
                color="green"
              />
            </div>

            <h3 className="font-semibold mb-4 mt-6">DataTypeItem</h3>
            <div className="space-y-2">
              <DataTypeItem label="Well Logs" description="Gamma ray, resistivity, porosity measurements" />
              <DataTypeItem label="Seismic Data" description="Amplitude, frequency, velocity data" />
            </div>

            <h3 className="font-semibold mb-4 mt-6">FormulaBox</h3>
            <FormulaBox
              formula={
                <>
                  d<sub>i</sub>
                  <sup>norm</sup> = (d<sub>i</sub> - μ<sub>i</sub>) / σ<sub>i</sub>
                </>
              }
              description="Z-score normalization formula"
            />

            <h3 className="font-semibold mb-4 mt-6">TroubleshootingItem</h3>
            <div className="space-y-3">
              <TroubleshootingItem
                problem="No datasets available for preview"
                cause="No datasets have been uploaded"
                solution="Go to the Upload tab and add at least one dataset"
                severity="error"
              />
              <TroubleshootingItem
                problem="Found X missing values"
                cause="Dataset contains empty or invalid values"
                solution="Use the 'Clean All Datasets' button"
                severity="warning"
              />
            </div>

            <h3 className="font-semibold mb-4 mt-6">FeatureCard</h3>
            <GuideGrid columns={4}>
              <FeatureCard
                icon={<Upload className="h-8 w-8 mx-auto text-blue-600" />}
                title="1. Upload Data"
                description="Add your heterogeneous datasets"
              />
              <FeatureCard
                icon={<Eye className="h-8 w-8 mx-auto text-green-600" />}
                title="2. Preview & Validate"
                description="Review data quality and structure"
              />
              <FeatureCard
                icon={<TrendingUp className="h-8 w-8 mx-auto text-orange-600" />}
                title="3. Normalize"
                description="Apply statistical normalization"
              />
              <FeatureCard
                icon={<Database className="h-8 w-8 mx-auto text-purple-600" />}
                title="4. Integrate"
                description="Create unified model"
              />
            </GuideGrid>
          </GuideSection>

          <GuideSection
            title="Interactive Components"
            description="Components with interactive functionality"
            icon={AlertTriangle}
            className="mt-6"
            id="interactive"
          >
            <h3 className="font-semibold mb-4">ExpandableSection</h3>
            <div className="space-y-3">
              <ExpandableSection title="Click to expand this section">
                <p>This content is hidden until the user clicks to expand it.</p>
                <p>
                  It's useful for FAQs, detailed explanations, and other content that might be too lengthy to show by
                  default.
                </p>
              </ExpandableSection>

              <ExpandableSection title="Another expandable section" defaultExpanded={true}>
                <p>This section is expanded by default.</p>
                <p>You can control the initial state with the defaultExpanded prop.</p>
              </ExpandableSection>
            </div>
          </GuideSection>

          <GuideSection
            title="Alert Components"
            description="Components for displaying alerts and notifications"
            icon={AlertTriangle}
            className="mt-6"
            id="alerts"
          >
            <h3 className="font-semibold mb-4">AlertBox</h3>
            <div className="space-y-4">
              <AlertBox type="info" title="Information">
                <p>This is an informational alert box. Use it to provide helpful tips and additional context.</p>
              </AlertBox>

              <AlertBox type="warning" title="Warning">
                <p>
                  This is a warning alert box. Use it to warn users about potential issues or important considerations.
                </p>
              </AlertBox>

              <AlertBox type="success" title="Success">
                <p>This is a success alert box. Use it to confirm successful operations or highlight best practices.</p>
              </AlertBox>

              <AlertBox type="error" title="Error">
                <p>This is an error alert box. Use it to highlight critical issues that need immediate attention.</p>
              </AlertBox>
            </div>
          </GuideSection>
        </GuideGrid>
      </GuidePage>
    </I18nProvider>
  )
}
