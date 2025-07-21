"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Play, CheckCircle, TrendingUp } from "lucide-react"
import { useI18n } from "../../lib/i18n/context"
import { notificationService } from "../../lib/notifications/notification-service"
import type { DataSet } from "../page"

interface NormalizationEngineProps {
  datasets: DataSet[]
  setDatasets: (datasets: DataSet[]) => void
  onNext: () => void
}

type NormalizationMethod = "zscore" | "minmax" | "robust" | "quantile"

export function NormalizationEngine({ datasets, setDatasets, onNext }: NormalizationEngineProps) {
  const { t } = useI18n()
  const [selectedMethod, setSelectedMethod] = useState<NormalizationMethod>("zscore")
  const [isNormalizing, setIsNormalizing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [normalizedDatasets, setNormalizedDatasets] = useState<string[]>([])

  const normalizationMethods = [
    {
      value: "zscore" as const,
      label: t.normalize.zScore,
      description: "Standardizes data to have mean=0 and std=1",
      formula: "(x - μ) / σ",
    },
    {
      value: "minmax" as const,
      label: t.normalize.minMax,
      description: "Scales data to range [0, 1]",
      formula: "(x - min) / (max - min)",
    },
    {
      value: "robust" as const,
      label: t.normalize.robust,
      description: "Uses median and IQR for outlier resistance",
      formula: "(x - median) / IQR",
    },
    {
      value: "quantile" as const,
      label: t.normalize.quantile,
      description: "Maps data to uniform distribution",
      formula: "F⁻¹(rank(x) / n)",
    },
  ]

  const normalizeData = (data: any[], method: NormalizationMethod) => {
    const numericColumns = Object.keys(data[0]).filter((key) => typeof data[0][key] === "number")

    const normalizedData = data.map((row) => {
      const newRow = { ...row }

      numericColumns.forEach((column) => {
        const values = data.map((r) => r[column]).filter((v) => typeof v === "number")

        if (values.length === 0) return

        const originalValue = row[column]
        let normalizedValue: number

        switch (method) {
          case "zscore":
            const mean = values.reduce((a, b) => a + b, 0) / values.length
            const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length
            const stdDev = Math.sqrt(variance)
            normalizedValue = stdDev === 0 ? 0 : (originalValue - mean) / stdDev
            break

          case "minmax":
            const min = Math.min(...values)
            const max = Math.max(...values)
            normalizedValue = max === min ? 0 : (originalValue - min) / (max - min)
            break

          case "robust":
            const sorted = [...values].sort((a, b) => a - b)
            const q1 = sorted[Math.floor(sorted.length * 0.25)]
            const q3 = sorted[Math.floor(sorted.length * 0.75)]
            const median = sorted[Math.floor(sorted.length * 0.5)]
            const iqr = q3 - q1
            normalizedValue = iqr === 0 ? 0 : (originalValue - median) / iqr
            break

          case "quantile":
            const rank = values.filter((v) => v <= originalValue).length
            normalizedValue = rank / values.length
            break

          default:
            normalizedValue = originalValue
        }

        newRow[column] = Number(normalizedValue.toFixed(6))
      })

      return newRow
    })

    return normalizedData
  }

  const handleNormalization = async () => {
    setIsNormalizing(true)
    setProgress(0)

    notificationService.notify({
      type: "normalize",
      stage: "Normalization Started",
      message: `Starting ${selectedMethod} normalization for ${datasets.length} datasets`,
    })

    const updatedDatasets = [...datasets]
    const totalSteps = datasets.length * 100

    for (let i = 0; i < datasets.length; i++) {
      const dataset = datasets[i]

      // Simulate processing steps
      for (let step = 0; step < 100; step += 10) {
        await new Promise((resolve) => setTimeout(resolve, 50))
        const currentProgress = ((i * 100 + step) / totalSteps) * 100
        setProgress(currentProgress)

        if (step === 50) {
          notificationService.notify({
            type: "normalize",
            stage: "Processing",
            message: `Normalizing ${dataset.name}...`,
            progress: currentProgress,
            datasetName: dataset.name,
          })
        }
      }

      // Apply normalization
      const normalizedData = normalizeData(dataset.data, selectedMethod)
      updatedDatasets[i] = {
        ...dataset,
        data: normalizedData,
        normalized: true,
        normalizationMethod: selectedMethod,
      }

      setNormalizedDatasets((prev) => [...prev, dataset.id])

      notificationService.notify({
        type: "success",
        stage: "Dataset Normalized",
        message: `${dataset.name} normalized successfully using ${selectedMethod}`,
        datasetName: dataset.name,
      })
    }

    setDatasets(updatedDatasets)
    setProgress(100)
    setIsNormalizing(false)

    notificationService.notify({
      type: "success",
      stage: "Normalization Complete",
      message: `All ${datasets.length} datasets normalized successfully`,
    })

    // Auto-advance after a short delay
    setTimeout(() => {
      onNext()
    }, 2000)
  }

  if (datasets.length === 0) {
    return (
      <Card className="petroleum-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Settings className="h-12 w-12 text-slate-400 mb-4" />
          <p className="text-lg font-medium text-slate-300 mb-2">No Datasets Available</p>
          <p className="text-slate-400 text-center">{t.home.errors.beforeNormalization}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Normalization Configuration */}
      <Card className="petroleum-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <TrendingUp className="h-5 w-5" />
            {t.normalize.title}
          </CardTitle>
          <CardDescription className="text-slate-400">{t.normalize.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">{t.normalize.algorithm}</label>
            <Select value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as NormalizationMethod)}>
              <SelectTrigger className="petroleum-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="petroleum-select-content">
                {normalizationMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{method.label}</span>
                      <span className="text-xs text-slate-400">{method.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Method Details */}
          <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-600/30">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="petroleum-badge">Selected Method</Badge>
              <span className="text-slate-200 font-medium">
                {normalizationMethods.find((m) => m.value === selectedMethod)?.label}
              </span>
            </div>
            <p className="text-sm text-slate-300 mb-2">
              {normalizationMethods.find((m) => m.value === selectedMethod)?.description}
            </p>
            <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
              <code className="text-cyan-400 mono text-sm">
                {normalizationMethods.find((m) => m.value === selectedMethod)?.formula}
              </code>
            </div>
          </div>

          {/* Dataset Summary */}
          <div>
            <h4 className="text-sm font-medium text-slate-200 mb-3">Datasets to Normalize</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {datasets.map((dataset) => (
                <div
                  key={dataset.id}
                  className={`p-3 rounded-lg border ${
                    normalizedDatasets.includes(dataset.id)
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-slate-800/30 border-slate-600/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {normalizedDatasets.includes(dataset.id) && <CheckCircle className="h-4 w-4 text-green-400" />}
                    <span className="text-sm font-medium text-slate-200 truncate">{dataset.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Badge className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">{dataset.type}</Badge>
                    <span>{dataset.data.length} records</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          {isNormalizing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">{t.normalize.normalizing}</span>
                <span className="text-slate-400">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Action Button */}
          <Button onClick={handleNormalization} disabled={isNormalizing} className="petroleum-button w-full">
            {isNormalizing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                {t.normalize.normalizing}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                {t.normalize.startNormalization}
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Preview */}
      {normalizedDatasets.length > 0 && (
        <Card className="petroleum-card">
          <CardHeader>
            <CardTitle className="text-slate-100">{t.normalize.results}</CardTitle>
            <CardDescription className="text-slate-400">
              {normalizedDatasets.length} of {datasets.length} datasets normalized
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-800/30 border-slate-600/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 mono">{normalizedDatasets.length}</div>
                  <div className="text-sm text-slate-400">Datasets Normalized</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/30 border-slate-600/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400 mono">
                    {datasets.reduce((sum, d) => sum + d.data.length, 0)}
                  </div>
                  <div className="text-sm text-slate-400">Records Processed</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/30 border-slate-600/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400 mono">{selectedMethod.toUpperCase()}</div>
                  <div className="text-sm text-slate-400">Method Used</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
