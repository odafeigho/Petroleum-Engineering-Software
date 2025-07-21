"use client"

import {
  GuidePage,
  GuideHeader,
  GuideSection,
  GuideGrid,
  GuideTabs,
  AlertBox,
  FaqItem,
  GlossaryItem,
  StepItem,
  DataTypeItem,
  FormulaBox,
  TroubleshootingItem,
  FeatureCard,
  PrintableContent,
} from "./guide"

import { Upload, Eye, TrendingUp, Database, BookOpen, AlertTriangle, Info, Download } from "lucide-react"
import { useI18n } from "../lib/i18n/context"

export function UserGuide() {
  const { t } = useI18n()

  const overviewContent = (
    <>
      <GuideSection
        title={t.guide.overview.gettingStarted.title}
        description={t.guide.overview.gettingStarted.description}
        icon={BookOpen}
      >
        <GuideGrid>
          <div>
            <h3 className="font-semibold mb-2">{t.guide.overview.gettingStarted.whatIs.title}</h3>
            <p className="text-sm text-muted-foreground">{t.guide.overview.gettingStarted.whatIs.description}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">{t.guide.overview.gettingStarted.whyImportant.title}</h3>
            <p className="text-sm text-muted-foreground">{t.guide.overview.gettingStarted.whyImportant.description}</p>
          </div>
        </GuideGrid>

        <FormulaBox
          formula={
            <>
              <strong>{t.guide.overview.gettingStarted.whatIs.title.split(" ")[2]}:</strong> d<sub>i</sub>
              <sup>norm</sup> = (d<sub>i</sub> - μ<sub>i</sub>) / σ<sub>i</sub> <br />
              <strong>Integration:</strong> M = ⋃ᵢ₌₁ⁿ T(d<sub>i</sub>
              <sup>norm</sup>)
            </>
          }
          description={t.guide.overview.coreAlgorithm.description}
        />

        <GuideGrid columns={4}>
          <FeatureCard
            icon={<Upload className="h-8 w-8 mx-auto text-blue-600" />}
            title={`1. ${t.guide.overview.workflow.steps.upload.title}`}
            description={t.guide.overview.workflow.steps.upload.description}
          />
          <FeatureCard
            icon={<Eye className="h-8 w-8 mx-auto text-green-600" />}
            title={`2. ${t.guide.overview.workflow.steps.preview.title}`}
            description={t.guide.overview.workflow.steps.preview.description}
          />
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8 mx-auto text-orange-600" />}
            title={`3. ${t.guide.overview.workflow.steps.normalize.title}`}
            description={t.guide.overview.workflow.steps.normalize.description}
          />
          <FeatureCard
            icon={<Database className="h-8 w-8 mx-auto text-purple-600" />}
            title={`4. ${t.guide.overview.workflow.steps.integrate.title}`}
            description={t.guide.overview.workflow.steps.integrate.description}
          />
        </GuideGrid>
      </GuideSection>
    </>
  )

  const uploadContent = (
    <>
      <GuideSection title={t.guide.upload.title} description={t.guide.upload.description} icon={Upload}>
        <GuideGrid>
          <div className="space-y-4">
            <h3 className="font-semibold">{t.guide.upload.supportedTypes.title}</h3>
            <div className="space-y-2">
              <DataTypeItem
                label={t.guide.upload.supportedTypes.wellLogs.label}
                description={t.guide.upload.supportedTypes.wellLogs.description}
              />
              <DataTypeItem
                label={t.guide.upload.supportedTypes.seismic.label}
                description={t.guide.upload.supportedTypes.seismic.description}
              />
              <DataTypeItem
                label={t.guide.upload.supportedTypes.production.label}
                description={t.guide.upload.supportedTypes.production.description}
              />
              <DataTypeItem
                label={t.guide.upload.supportedTypes.core.label}
                description={t.guide.upload.supportedTypes.core.description}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">{t.guide.upload.instructions.title}</h3>
            <div className="space-y-3">
              <StepItem
                number={1}
                title={t.guide.upload.instructions.step1.title}
                description={t.guide.upload.instructions.step1.description}
              />
              <StepItem
                number={2}
                title={t.guide.upload.instructions.step2.title}
                description={t.guide.upload.instructions.step2.description}
              />
              <StepItem
                number={3}
                title={t.guide.upload.instructions.step3.title}
                description={t.guide.upload.instructions.step3.description}
              />
            </div>
          </div>
        </GuideGrid>

        <AlertBox type="info" title={t.guide.upload.exampleWorkflow.title}>
          <p>{t.guide.upload.exampleWorkflow.description}</p>
        </AlertBox>
      </GuideSection>
    </>
  )

  const faqContent = (
    <>
      <GuideSection title={t.guide.faq.title} description={t.guide.faq.description} icon={Info}>
        <div className="space-y-4">
          <FaqItem
            question={t.guide.faq.questions.dataTypes.question}
            answer={<p>{t.guide.faq.questions.dataTypes.answer}</p>}
          />

          <FaqItem
            question={t.guide.faq.questions.normalization.question}
            answer={<p>{t.guide.faq.questions.normalization.answer}</p>}
          />

          <FaqItem
            question={t.guide.faq.questions.accuracy.question}
            answer={<p>{t.guide.faq.questions.accuracy.answer}</p>}
          />

          <FaqItem
            question={t.guide.faq.questions.security.question}
            answer={<p>{t.guide.faq.questions.security.answer}</p>}
          />
        </div>
      </GuideSection>
    </>
  )

  const glossaryContent = (
    <>
      <GuideSection title={t.guide.glossary.title} description={t.guide.glossary.description} icon={BookOpen}>
        <GuideGrid>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">{t.guide.glossary.reservoirTerms.title}</h3>

            <div className="space-y-3">
              <GlossaryItem
                term={t.guide.glossary.reservoirTerms.porosity.term}
                definition={t.guide.glossary.reservoirTerms.porosity.definition}
                color="purple"
              />

              <GlossaryItem
                term={t.guide.glossary.reservoirTerms.permeability.term}
                definition={t.guide.glossary.reservoirTerms.permeability.definition}
                color="green"
              />

              <GlossaryItem
                term={t.guide.glossary.reservoirTerms.resistivity.term}
                definition={t.guide.glossary.reservoirTerms.resistivity.definition}
                color="orange"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">{t.guide.glossary.dataScienceTerms.title}</h3>

            <div className="space-y-3">
              <GlossaryItem
                term={t.guide.glossary.dataScienceTerms.normalization.term}
                definition={t.guide.glossary.dataScienceTerms.normalization.definition}
                color="purple"
              />

              <GlossaryItem
                term={t.guide.glossary.dataScienceTerms.standardDeviation.term}
                definition={t.guide.glossary.dataScienceTerms.standardDeviation.definition}
                color="red"
              />

              <GlossaryItem
                term={t.guide.glossary.dataScienceTerms.zScore.term}
                definition={t.guide.glossary.dataScienceTerms.zScore.definition}
                color="teal"
              />
            </div>
          </div>
        </GuideGrid>
      </GuideSection>
    </>
  )

  const printContent = (
    <>
      <GuideSection title={t.guide.print.title} description={t.guide.print.description} icon={Download}>
        <PrintableContent title={t.guide.title}>
          <div className="print-content">
            <h1>{t.guide.title}</h1>
            <p>{t.guide.description}</p>

            <h2>1. {t.guide.overview.title}</h2>
            <p>{t.guide.overview.gettingStarted.whatIs.description}</p>

            <h3>{t.guide.overview.coreAlgorithm.title}</h3>
            <p>{t.guide.overview.coreAlgorithm.description}</p>

            <h2>2. {t.guide.overview.workflow.steps.upload.title}</h2>
            <p>1. {t.guide.overview.workflow.steps.upload.description}</p>
            <p>2. {t.guide.overview.workflow.steps.preview.description}</p>
            <p>3. {t.guide.overview.workflow.steps.normalize.description}</p>
            <p>4. {t.guide.overview.workflow.steps.integrate.description}</p>
          </div>
        </PrintableContent>
      </GuideSection>
    </>
  )

  const troubleshootingContent = (
    <>
      <GuideSection
        title={t.guide.troubleshooting.title}
        description={t.guide.troubleshooting.description}
        icon={AlertTriangle}
      >
        <div className="space-y-4">
          <TroubleshootingItem
            problem={t.guide.troubleshooting.problems.noDatasets.problem}
            cause={t.guide.troubleshooting.problems.noDatasets.cause}
            solution={t.guide.troubleshooting.problems.noDatasets.solution}
            severity="error"
          />

          <TroubleshootingItem
            problem={t.guide.troubleshooting.problems.notNormalized.problem}
            cause={t.guide.troubleshooting.problems.notNormalized.cause}
            solution={t.guide.troubleshooting.problems.notNormalized.solution}
            severity="error"
          />

          <TroubleshootingItem
            problem={t.guide.troubleshooting.problems.missingValues.problem}
            cause={t.guide.troubleshooting.problems.missingValues.cause}
            solution={t.guide.troubleshooting.problems.missingValues.solution}
            severity="warning"
          />
        </div>

        <AlertBox type="success" title={t.guide.troubleshooting.bestPractices.title}>
          <ul className="space-y-1">
            {t.guide.troubleshooting.bestPractices.items.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </AlertBox>
      </GuideSection>
    </>
  )

  const tabs = [
    { id: "overview", label: t.guide.overview.title, content: overviewContent },
    { id: "upload", label: t.guide.upload.title, content: uploadContent },
    { id: "faq", label: "FAQ", content: faqContent },
    { id: "glossary", label: t.guide.glossary.title, content: glossaryContent },
    { id: "print", label: t.common.print, content: printContent },
    { id: "troubleshooting", label: t.guide.troubleshooting.title, content: troubleshootingContent },
  ]

  return (
    <GuidePage>
      <GuideHeader />
      <GuideTabs tabs={tabs} defaultTab="overview" />
    </GuidePage>
  )
}

export default UserGuide
