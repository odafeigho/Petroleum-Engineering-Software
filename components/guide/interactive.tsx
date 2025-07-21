"use client"

import { useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Download, Printer } from "lucide-react"

interface ExpandableSectionProps {
  title: string
  children: ReactNode
  defaultExpanded?: boolean
}

export function ExpandableSection({ title, children, defaultExpanded = false }: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 text-left font-medium bg-gray-50 hover:bg-gray-100 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>{title}</span>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isExpanded && <div className="p-4 border-t">{children}</div>}
    </div>
  )
}

interface PrintableContentProps {
  children: ReactNode
  title?: string
  filename?: string
}

export function PrintableContent({
  children,
  title = "User Guide",
  filename = "user-guide.pdf",
}: PrintableContentProps) {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Create a new window with the printable content
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .section { margin-bottom: 30px; page-break-inside: avoid; }
            .section-title { color: #2563eb; font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
            .page-break { page-break-before: always; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <p><em>Generated on ${new Date().toLocaleDateString()}</em></p>
          </div>
          ${children}
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 justify-center">
        <Button onClick={handlePrint} className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Print Guide
        </Button>
        <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>
      <div className="print-content hidden">{children}</div>
    </div>
  )
}

interface TabContentProps {
  children: ReactNode
}

export function TabContent({ children }: TabContentProps) {
  return <div className="space-y-6">{children}</div>
}

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="text-center p-4 border rounded-lg">
      <div className="mx-auto mb-2">{icon}</div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  )
}
