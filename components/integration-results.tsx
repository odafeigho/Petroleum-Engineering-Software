"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Database, CheckCircle, AlertTriangle, BarChart3 } from "lucide-react"
import type { DataSet } from "../app/page"
import { useI18n } from "../lib/i18n/context"
import { notificationService } from "../lib/notifications/notification-service"

interface IntegrationResultsProps {
  datasets: DataSet[]
}

interface IntegrationResult {
  totalRecords: number
  successfulIntegrations: number
  conflicts: number
  accuracy: number
  processingTime: number
  unifiedSchema: string[]
  dataQuality: {
    completeness: number
    consistency: number
    accuracy: number
    validity: number
  }
}

export function IntegrationResults({ datasets }: IntegrationResultsProps) {
  const { t } = useI18n()
  const [isIntegrating, setIsIntegrating] = useState(false)
  const [integrationProgress, setIntegrationProgress] = useState(0)
  const [results, setResults] = useState<IntegrationResult | null>(null)
  const [integratedData, setIntegratedData] = useState<any[]>([])

  const normalizedDatasets = datasets.filter((d) => d.normalized)

  const startIntegration = async () => {
    if (normalizedDatasets.length === 0) {
      notificationService.notify({
        type: "error",
        stage: "Integration Error",
        message: "No normalized datasets available for integration",
      })
      return
    }

    setIsIntegrating(true)
    setIntegrationProgress(0)

    notificationService.notify({
      type: "integrate",
      stage: "Starting Integration",
      message: `Integrating ${normalizedDatasets.length} normalized datasets`,
      progress: 0,
    })

    // Simulate integration process
    const steps = [
      "Analyzing schema compatibility",
      "Resolving data conflicts",
      "Merging datasets",
      "Validating integrated data",
      "Generating quality metrics",
      "Finalizing integration",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const progress = Math.round(((i + 1) / steps.length) * 100)
      setIntegrationProgress(progress)

      notificationService.notify({
        type: "integrate",
        stage: steps[i],
        message: `Step ${i + 1} of ${steps.length}: ${steps[i]}`,
        progress,
      })
    }

    // Generate mock integration results
    const totalRecords = normalizedDatasets.reduce((sum, dataset) => sum + dataset.data.length, 0)
    const mockResults: IntegrationResult = {
      totalRecords,
      successfulIntegrations: Math.floor(totalRecords * 0.95),
      conflicts: Math.floor(totalRecords * 0.05),
      accuracy: 94.5 + Math.random() * 4,
      processingTime: (totalRecords / 1000) * 2.3,
      unifiedSchema: [
        "well_id",
        "depth",
        "porosity",
        "permeability",
        "saturation",
        "pressure",
        "temperature",
        "lithology",
        "formation",
        "timestamp",
      ],
      dataQuality: {
        completeness: 92.3 + Math.random() * 5,
        consistency: 89.7 + Math.random() * 8,
        accuracy: 94.1 + Math.random() * 4,
        validity: 96.8 + Math.random() * 2,
      },
    }

    // Generate mock integrated data
    const mockIntegratedData = Array.from({ length: Math.min(100, totalRecords) }, (_, i) => ({
      id: i + 1,
      well_id: `WELL_${String(i + 1).padStart(3, "0")}`,
      depth: 1000 + Math.random() * 2000,
      porosity: 0.1 + Math.random() * 0.3,
      permeability: Math.random() * 1000,
      saturation: 0.3 + Math.random() * 0.7,
      pressure: 2000 + Math.random() * 3000,
      temperature: 60 + Math.random() * 80,
      lithology: ["Sandstone", "Limestone", "Shale", "Dolomite"][Math.floor(Math.random() * 4)],
      formation: ["Formation_A", "Formation_B", "Formation_C"][Math.floor(Math.random() * 3)],
      timestamp: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    }))

    setResults(mockResults)
    setIntegratedData(mockIntegratedData)
    setIsIntegrating(false)

    notificationService.notify({
      type: "success",
      stage: "Integration Complete",
      message: `Successfully integrated ${mockResults.successfulIntegrations} records with ${mockResults.accuracy.toFixed(1)}% accuracy`,
    })
  }

  const exportResults = () => {
    if (!results || integratedData.length === 0) return

    const csvContent = [
      results.unifiedSchema.join(","),
      ...integratedData.map((row) => results.unifiedSchema.map((col) => row[col] || "").join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "integrated_reservoir_data.csv"
    a.click()
    URL.revokeObjectURL(url)

    notificationService.notify({
      type: "export",
      stage: "Export Complete",
      message: "Integrated data exported successfully",
    })
  }

  if (normalizedDatasets.length === 0) {
    return (
      <Card className="petroleum-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-200">
            <Database className="h-5 w-5" />
            {t.integrate?.title || "Data Integration"}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {t.integrate?.description || "Integrate normalized datasets into a unified model"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-slate-300 mb-2">No normalized datasets available</p>
            <p className="text-slate-400 text-sm">Please normalize your datasets first before integration</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="petroleum-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-200">
            <Database className="h-5 w-5" />
            {t.integrate?.title || "Data Integration"}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {t.integrate?.description || "Integrate normalized datasets into a unified model"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="petroleum-card p-4">
              <div className="text-2xl font-bold text-blue-400 mono">{normalizedDatasets.length}</div>
              <div className="text-sm text-slate-400">Normalized Datasets</div>
            </div>
            <div className="petroleum-card p-4">
              <div className="text-2xl font-bold text-cyan-400 mono">
                {normalizedDatasets.reduce((sum, d) => sum + d.data.length, 0).toLocaleString()}
              </div>
              <div className="text-sm text-slate-400">Total Records</div>
            </div>
            <div className="petroleum-card p-4">
              <div className="text-2xl font-bold text-green-400 mono">
                {results ? `${results.accuracy.toFixed(1)}%` : "—"}
              </div>
              <div className="text-sm text-slate-400">Integration Accuracy</div>
            </div>
          </div>

          {isIntegrating && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-slate-300">Integrating datasets...</span>
              </div>
              <Progress value={integrationProgress} className="w-full" />
              <p className="text-sm text-slate-400">{integrationProgress}% complete</p>
            </div>
          )}

          {!results && !isIntegrating && (
            <Button onClick={startIntegration} className="petroleum-button w-full">
              <Database className="h-4 w-4 mr-2" />
              Start Integration
            </Button>
          )}
        </CardContent>
      </Card>

      {results && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/30">
            <TabsTrigger value="overview" className="petroleum-tab">
              Overview
            </TabsTrigger>
            <TabsTrigger value="data" className="petroleum-tab">
              Integrated Data
            </TabsTrigger>
            <TabsTrigger value="quality" className="petroleum-tab">
              Quality Metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="petroleum-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-200">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Integration Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="petroleum-card p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400 mono">{results.totalRecords.toLocaleString()}</div>
                    <div className="text-xs text-slate-400">Total Records</div>
                  </div>
                  <div className="petroleum-card p-4 text-center">
                    <div className="text-2xl font-bold text-green-400 mono">
                      {results.successfulIntegrations.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">Successful</div>
                  </div>
                  <div className="petroleum-card p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400 mono">{results.conflicts}</div>
                    <div className="text-xs text-slate-400">Conflicts Resolved</div>
                  </div>
                  <div className="petroleum-card p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400 mono">{results.processingTime.toFixed(1)}s</div>
                    <div className="text-xs text-slate-400">Processing Time</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-slate-200">Unified Schema</h4>
                  <div className="flex flex-wrap gap-2">
                    {results.unifiedSchema.map((field, index) => (
                      <Badge key={index} className="petroleum-badge">
                        {field}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button onClick={exportResults} className="petroleum-button w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Integrated Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data">
            <Card className="petroleum-card">
              <CardHeader>
                <CardTitle className="text-slate-200">Integrated Dataset Preview</CardTitle>
                <CardDescription className="text-slate-400">
                  Showing first 100 records of {results.totalRecords.toLocaleString()} total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="data-grid rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {results.unifiedSchema.slice(0, 6).map((field) => (
                          <TableHead key={field} className="text-slate-200 font-semibold">
                            {field.replace("_", " ").toUpperCase()}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {integratedData.slice(0, 10).map((row, index) => (
                        <TableRow key={index} className="hover:bg-slate-700/20">
                          {results.unifiedSchema.slice(0, 6).map((field) => (
                            <TableCell key={field} className="text-slate-300">
                              {typeof row[field] === "number" ? row[field].toFixed(2) : row[field]?.toString() || "—"}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality">
            <Card className="petroleum-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-200">
                  <BarChart3 className="h-5 w-5" />
                  Data Quality Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(results.dataQuality).map(([metric, value]) => (
                    <div key={metric} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 capitalize">{metric}</span>
                        <span className="text-slate-200 font-mono">{value.toFixed(1)}%</span>
                      </div>
                      <Progress value={value} className="w-full" />
                    </div>
                  ))}
                </div>

                <div className="petroleum-card p-4">
                  <h4 className="text-lg font-semibold text-slate-200 mb-3">Quality Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Overall Quality Score:</span>
                      <span className="text-green-400 font-semibold">
                        {Object.values(results.dataQuality).reduce((a, b) => a + b, 0) / 4}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Integration Success Rate:</span>
                      <span className="text-blue-400 font-semibold">{results.accuracy.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Data Conflicts Resolved:</span>
                      <span className="text-yellow-400 font-semibold">{results.conflicts}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
