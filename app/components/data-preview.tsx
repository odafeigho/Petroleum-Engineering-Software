"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart3, Eye, FileText, AlertTriangle, CheckCircle } from "lucide-react"
import { useI18n } from "../../lib/i18n/context"
import type { DataSet } from "../page"

interface DataPreviewProps {
  datasets: DataSet[]
}

export function DataPreview({ datasets }: DataPreviewProps) {
  const { t } = useI18n()
  const [selectedDataset, setSelectedDataset] = useState<string>(datasets[0]?.id || "")

  if (datasets.length === 0) {
    return (
      <Card className="petroleum-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Eye className="h-12 w-12 text-slate-400 mb-4" />
          <p className="text-lg font-medium text-slate-300 mb-2">{t.preview.noData}</p>
          <p className="text-slate-400 text-center">Upload datasets to see preview and analysis</p>
        </CardContent>
      </Card>
    )
  }

  const currentDataset = datasets.find((d) => d.id === selectedDataset) || datasets[0]

  const calculateStats = (data: any[]) => {
    if (!data.length) return null

    const numericColumns = Object.keys(data[0]).filter((key) => typeof data[0][key] === "number")
    const stats: Record<string, any> = {}

    numericColumns.forEach((column) => {
      const values = data.map((row) => row[column]).filter((val) => typeof val === "number")
      if (values.length > 0) {
        const sorted = values.sort((a, b) => a - b)
        const sum = values.reduce((a, b) => a + b, 0)
        const mean = sum / values.length
        const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length

        stats[column] = {
          mean: mean.toFixed(2),
          median: sorted[Math.floor(sorted.length / 2)].toFixed(2),
          stdDev: Math.sqrt(variance).toFixed(2),
          min: Math.min(...values).toFixed(2),
          max: Math.max(...values).toFixed(2),
        }
      }
    })

    return stats
  }

  const getDataQuality = (data: any[]) => {
    if (!data.length) return { score: 0, issues: [] }

    const totalCells = data.length * Object.keys(data[0]).length
    let missingValues = 0
    let duplicates = 0

    // Count missing values
    data.forEach((row) => {
      Object.values(row).forEach((value) => {
        if (value === null || value === undefined || value === "") {
          missingValues++
        }
      })
    })

    // Simple duplicate detection (by ID if exists)
    if (data[0].id) {
      const ids = data.map((row) => row.id)
      duplicates = ids.length - new Set(ids).size
    }

    const missingPercentage = (missingValues / totalCells) * 100
    const duplicatePercentage = (duplicates / data.length) * 100

    let score = 100
    score -= missingPercentage * 0.5
    score -= duplicatePercentage * 2

    const issues = []
    if (missingPercentage > 5) issues.push(`${missingPercentage.toFixed(1)}% missing values`)
    if (duplicatePercentage > 0) issues.push(`${duplicates} duplicate records`)

    return { score: Math.max(0, score), issues }
  }

  const stats = calculateStats(currentDataset.data)
  const quality = getDataQuality(currentDataset.data)

  const getTypeColor = (type: string) => {
    switch (type) {
      case "logs":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "seismic":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "production":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "core":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      {/* Dataset Selector */}
      <Card className="petroleum-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <BarChart3 className="h-5 w-5" />
            {t.preview.title}
          </CardTitle>
          <CardDescription className="text-slate-400">{t.preview.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {datasets.map((dataset) => (
              <Button
                key={dataset.id}
                variant={selectedDataset === dataset.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDataset(dataset.id)}
                className={`flex items-center gap-2 ${
                  selectedDataset === dataset.id
                    ? "petroleum-button"
                    : "bg-slate-800/30 border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                <FileText className="h-4 w-4" />
                {dataset.name}
                <Badge className={`text-xs ${getTypeColor(dataset.type)}`}>{dataset.type}</Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dataset Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="petroleum-card">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-400 mono">{currentDataset.data.length}</div>
            <div className="text-sm text-slate-400 uppercase tracking-wide">{t.preview.records}</div>
          </CardContent>
        </Card>
        <Card className="petroleum-card">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-cyan-400 mono">
              {currentDataset.data.length > 0 ? Object.keys(currentDataset.data[0]).length : 0}
            </div>
            <div className="text-sm text-slate-400 uppercase tracking-wide">{t.preview.columns}</div>
          </CardContent>
        </Card>
        <Card className="petroleum-card">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {quality.score >= 80 ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              )}
              <div className="text-2xl font-bold text-green-400 mono">{quality.score.toFixed(0)}%</div>
            </div>
            <div className="text-sm text-slate-400 uppercase tracking-wide">{t.preview.dataQuality}</div>
          </CardContent>
        </Card>
        <Card className="petroleum-card">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-400 mono">{currentDataset.type.toUpperCase()}</div>
            <div className="text-sm text-slate-400 uppercase tracking-wide">Dataset Type</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Card className="petroleum-card">
        <CardContent className="p-6">
          <Tabs defaultValue="data" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/30">
              <TabsTrigger value="data" className="petroleum-tab">
                Raw Data
              </TabsTrigger>
              <TabsTrigger value="statistics" className="petroleum-tab">
                {t.preview.statistics}
              </TabsTrigger>
              <TabsTrigger value="quality" className="petroleum-tab">
                {t.preview.dataQuality}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="data" className="mt-6">
              <div className="data-grid">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {currentDataset.data.length > 0 &&
                        Object.keys(currentDataset.data[0]).map((column) => (
                          <TableHead key={column} className="text-slate-200">
                            {column}
                          </TableHead>
                        ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentDataset.data.slice(0, 10).map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value, cellIndex) => (
                          <TableCell key={cellIndex} className="text-slate-300">
                            {typeof value === "number" ? value.toFixed(2) : String(value)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {currentDataset.data.length > 10 && (
                  <div className="p-4 text-center text-slate-400 text-sm">
                    Showing first 10 of {currentDataset.data.length} records
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="statistics" className="mt-6">
              {stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(stats).map(([column, columnStats]) => (
                    <Card key={column} className="bg-slate-800/30 border-slate-600/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-slate-200">{column}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">{t.preview.mean}:</span>
                          <span className="text-slate-200 mono">{columnStats.mean}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">{t.preview.median}:</span>
                          <span className="text-slate-200 mono">{columnStats.median}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">{t.preview.stdDev}:</span>
                          <span className="text-slate-200 mono">{columnStats.stdDev}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">{t.preview.min}:</span>
                          <span className="text-slate-200 mono">{columnStats.min}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">{t.preview.max}:</span>
                          <span className="text-slate-200 mono">{columnStats.max}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">No numeric data available for statistics</div>
              )}
            </TabsContent>

            <TabsContent value="quality" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {quality.score >= 80 ? (
                      <CheckCircle className="h-6 w-6 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-yellow-400" />
                    )}
                    <span className="text-lg font-medium text-slate-200">
                      Data Quality Score: {quality.score.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {quality.issues.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-slate-200">Issues Found:</h4>
                    <ul className="space-y-1">
                      {quality.issues.map((issue, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-yellow-300">
                          <AlertTriangle className="h-4 w-4" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {quality.issues.length === 0 && (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span>No data quality issues detected</span>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
