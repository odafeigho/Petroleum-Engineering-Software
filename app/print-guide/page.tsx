"use client"

import { I18nProvider } from "../../lib/i18n/context"
import { GuidePage, GuideHeader, GuideSection, PrintableContent } from "../components/guide"
import { FileText } from "lucide-react"

export default function PrintGuidePage() {
  return (
    <I18nProvider defaultLanguage="en">
      <div className="min-h-screen bg-white">
        <GuidePage>
          <GuideHeader
            title="Printable User Guide"
            description="Download or print a comprehensive PDF version of the complete user guide"
            useTranslations={false}
          />

          <GuideSection
            title="Printable User Guide"
            description="Download or print a comprehensive PDF version of the complete user guide"
            icon={FileText}
          >
            <PrintableContent title="Reservoir Data Harmonizer - User Guide">
              <div className="print-content">
                <h1>Reservoir Data Harmonizer - User Guide</h1>
                <p>Complete guide to harmonizing heterogeneous reservoir data</p>

                <h2>1. Overview</h2>
                <p>
                  Data harmonization is the process of bringing together data from different sources, formats, and
                  scales into a unified, consistent format that enables comprehensive analysis.
                </p>

                <h3>Core Algorithm</h3>
                <p>The Reservoir Data Harmonizer uses a two-step mathematical process:</p>
                <p>
                  Step 1: Data Normalization - d<sub>i</sub>
                  <sup>norm</sup> = (d<sub>i</sub> - μ<sub>i</sub>) / σ<sub>i</sub>
                </p>
                <p>
                  Step 2: Schema Integration - M = ⋃<sub>i=1</sub>
                  <sup>n</sup> T(d<sub>i</sub>
                  <sup>norm</sup>)
                </p>

                <h2>2. Workflow</h2>
                <p>1. Upload Data: Add your heterogeneous datasets</p>
                <p>2. Preview & Validate: Review data quality and structure</p>
                <p>3. Normalize: Apply statistical normalization</p>
                <p>4. Integrate: Create unified model</p>

                <h2>3. Frequently Asked Questions</h2>
                <h3>Q: What types of reservoir data can I harmonize?</h3>
                <p>A: The app supports four main types: Well Logs, Seismic Data, Production Data, and Core Analysis.</p>

                <h3>Q: Why is data normalization necessary?</h3>
                <p>
                  A: Different reservoir measurements have vastly different scales. Normalization puts all data on the
                  same scale.
                </p>

                <h2>4. Technical Glossary</h2>
                <h3>Porosity</h3>
                <p>The percentage of void space in rock that can contain fluids.</p>

                <h3>Permeability</h3>
                <p>A measure of rock's ability to transmit fluids, typically measured in millidarcies (mD).</p>

                <h3>Normalization</h3>
                <p>
                  Statistical technique to scale data to a standard range, typically with mean=0 and standard
                  deviation=1.
                </p>
              </div>
            </PrintableContent>
          </GuideSection>
        </GuidePage>
      </div>
    </I18nProvider>
  )
}
