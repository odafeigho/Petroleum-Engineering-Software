"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Printer, FileText } from "lucide-react"

export function PrintableGuide() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Printable User Guide
          </CardTitle>
          <CardDescription>Download or print a comprehensive PDF version of the complete user guide</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">What's Included</h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    ✓
                  </Badge>
                  Complete step-by-step workflow
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    ✓
                  </Badge>
                  Mathematical formulas and explanations
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    ✓
                  </Badge>
                  Frequently asked questions
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    ✓
                  </Badge>
                  Technical glossary
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    ✓
                  </Badge>
                  Troubleshooting guide
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Format Features</h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    📄
                  </Badge>
                  Professional PDF layout
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    🎨
                  </Badge>
                  Color-coded sections
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    📊
                  </Badge>
                  Mathematical formulas
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    💡
                  </Badge>
                  Examples and tips
                </li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print Guide
            </Button>
            <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Print Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use "Print to PDF" option in your browser for best results</li>
              <li>• Enable "Background graphics" for color-coded sections</li>
              <li>• Select "More settings" → "Paper size: A4" for optimal layout</li>
              <li>• Choose "Margins: Default" for proper spacing</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PrintableGuide
