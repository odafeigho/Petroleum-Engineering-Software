"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Database, Merge } from "lucide-react"
import type { DataSet, UnifiedModel } from "../page"

interface IntegrationResultsProps {
  datasets: DataSet[]
  unifiedModel: UnifiedModel[]
  setUnifiedModel: (model: UnifiedModel[]) => void
}

export function IntegrationResults({ datasets, unifiedModel, setUnifiedModel }: IntegrationResultsProps) {
  const [isIntegrating, setIsIntegrating] = useState(false)

  const transformationFunction = (dataset: DataSet): UnifiedModel[] => {
    if (!dataset.normalized || dataset.normalized.length === 0) return []

    return dataset.normalized.map((item, index) => {
      // Helper function to safely get numeric values
      const safeGetNumber = (value: any) => {
        const num = Number(value)
        return !isNaN(num) ? num : 0
      }

      const unified: UnifiedModel = {
        id: `${dataset.id}_${index}`,
        timestamp: item.timestamp || new Date().toISOString(),
        depth: safeGetNumber(item.depth) || 0,
        pressure: 0,
        temperature: 0,
        porosity: 0,
        permeability: 0,
        saturation: 0,
        source: dataset.name,
        dataType: dataset.type,
      }

      // Apply transformation based on data type
      switch (dataset.type) {
        case "logs":
          unified.porosity = safeGetNumber(item.porosity_norm) || safeGetNumber(item.porosity) || 0
          unified.pressure = safeGetNumber(item.resistivity_norm) || 0
          break
        case "seismic":
          unified.pressure = safeGetNumber(item.amplitude_norm) || 0
          unified.temperature = safeGetNumber(item.velocity_norm) || 0
          break
        case "production":
          unified.pressure = safeGetNumber(item.pressure_norm) || safeGetNumber(item.pressure) || 0
          unified.temperature = safeGetNumber(item.oil_rate_norm) || 0
          break
        case "core":
          unified.porosity = safeGetNumber(item.porosity_norm) || safeGetNumber(item.porosity) || 0
          unified.permeability = safeGetNumber(item.permeability_norm) || safeGetNumber(item.permeability) || 0
          unified.saturation = safeGetNumber(item.saturation_norm) || safeGetNumber(item.saturation) || 0
          break
      }

      return unified
    })
  }

  const handleIntegration = async () => {
    setIsIntegrating(true)

    try {
      // Simulate integration process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Apply transformation function T(d_i^norm) for each normalized dataset
      const integratedData: UnifiedModel[] = []

      datasets.forEach((dataset) => {
        if (dataset.normalized) {
          try {
            const transformed = transformationFunction(dataset)
            integratedData.push(...transformed)
          } catch (error) {
            console.error(`Error transforming dataset ${dataset.name}:`, error)
          }
        }
      })

      // M = ⋃ᵢ₌₁ⁿ T(dᵢⁿᵒʳᵐ) - Union of all transformed datasets
      setUnifiedModel(integratedData)
    } catch (error) {
      console.error("Integration error:", error)
    } finally {
      setIsIntegrating(false)
    }
  }

  const exportData = () => {
    const dataStr = JSON.stringify(unifiedModel, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "unified_reservoir_model.json"
    link.click()
  }

  const normalizedDatasets = datasets.filter((d) => d.normalized)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Integration Engine
          </CardTitle>
          <CardDescription>
            M = ⋃ᵢ₌₁ⁿ T(dᵢⁿᵒʳᵐ) - Transform and unite normalized datasets into unified model
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleIntegration}
              disabled={normalizedDatasets.length === 0 || isIntegrating}
              className="flex items-center gap-2"
            >
              <Merge className="h-4 w-4" />
              {isIntegrating ? "Integrating..." : "Start Integration"}
            </Button>

            {unifiedModel.length > 0 && (
              <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Unified Model
              </Button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{normalizedDatasets.length}</div>
              <div className="text-sm text-muted-foreground">Normalized Datasets</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{unifiedModel.length}</div>
              <div className="text-sm text-muted-foreground">Integrated Records</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(unifiedModel.map((m) => m.dataType)).size}
              </div>
              <div className="text-sm text-muted-foreground">Data Types Unified</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {unifiedModel.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Unified Reservoir Model (M)</CardTitle>
            <CardDescription>Harmonized data from all sources in standardized schema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Depth</TableHead>
                    <TableHead>Pressure</TableHead>
                    <TableHead>Temperature</TableHead>
                    <TableHead>Porosity</TableHead>
                    <TableHead>Permeability</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unifiedModel.slice(0, 10).map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-xs">{new Date(record.timestamp).toLocaleString()}</TableCell>
                      <TableCell className="font-mono">{record.depth.toFixed(1)}</TableCell>
                      <TableCell className="font-mono">{record.pressure.toFixed(3)}</TableCell>
                      <TableCell className="font-mono">{record.temperature.toFixed(3)}</TableCell>
                      <TableCell className="font-mono">{record.porosity.toFixed(3)}</TableCell>
                      <TableCell className="font-mono">{record.permeability.toFixed(3)}</TableCell>
                      <TableCell className="text-xs">{record.source}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.dataType}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Showing first 10 records of {unifiedModel.length} total unified records
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
