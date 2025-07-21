"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Database, Calendar, FileText, Download, Trash2, Eye } from "lucide-react"
import { datasetService } from "../../lib/database/datasets"
import { useAuth } from "../auth/auth-provider"
import type { DataSet } from "../../app/page"

interface DatasetLibraryProps {
  onDatasetSelect?: (dataset: DataSet) => void
  onDatasetLoad?: (datasets: DataSet[]) => void
  projectId?: string
}

export function DatasetLibrary({ onDatasetSelect, onDatasetLoad, projectId }: DatasetLibraryProps) {
  const { user } = useAuth()
  const [datasets, setDatasets] = useState<DataSet[]>([])
  const [filteredDatasets, setFilteredDatasets] = useState<DataSet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (user) {
      loadDatasets()
    }
  }, [user, projectId])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = datasets.filter(
        (dataset) =>
          dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dataset.type.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredDatasets(filtered)
    } else {
      setFilteredDatasets(datasets)
    }
  }, [datasets, searchQuery])

  const loadDatasets = async () => {
    if (!user) return

    try {
      setLoading(true)
      const data = await datasetService.getDatasets(user.id, projectId)
      setDatasets(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load datasets")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDataset = async (dataset: DataSet) => {
    if (!confirm(`Are you sure you want to delete "${dataset.name}"? This action cannot be undone.`)) {
      return
    }

    try {
      await datasetService.deleteDataset(dataset.id)
      await loadDatasets()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete dataset")
    }
  }

  const handleLoadSelected = () => {
    const selectedDatasets = datasets.filter((d) => (d as any).selected)
    if (selectedDatasets.length > 0 && onDatasetLoad) {
      onDatasetLoad(selectedDatasets)
    }
  }

  const toggleDatasetSelection = (datasetId: string) => {
    setDatasets((prev) => prev.map((d) => (d.id === datasetId ? { ...d, selected: !(d as any).selected } : d)))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "logs":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "seismic":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "production":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "core":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  if (loading) {
    return (
      <Card className="petroleum-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-slate-400">Loading datasets...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Dataset Library</h2>
          <p className="text-slate-400">Browse and manage your saved datasets</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search datasets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="petroleum-input pl-10 w-64"
            />
          </div>

          {datasets.some((d) => (d as any).selected) && (
            <Button onClick={handleLoadSelected} className="petroleum-button">
              Load Selected ({datasets.filter((d) => (d as any).selected).length})
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert className="border-red-500/50 bg-red-500/10">
          <AlertDescription className="text-red-400">{error}</AlertDescription>
        </Alert>
      )}

      {filteredDatasets.length === 0 ? (
        <Card className="petroleum-card">
          <CardContent className="p-12 text-center">
            <Database className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-300 mb-2">
              {searchQuery ? "No datasets found" : "No datasets saved"}
            </h3>
            <p className="text-slate-400">
              {searchQuery ? "Try adjusting your search terms" : "Upload and save datasets to see them here"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasets.map((dataset) => (
            <Card
              key={dataset.id}
              className={`petroleum-card cursor-pointer transition-all hover:scale-105 ${
                (dataset as any).selected ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => toggleDatasetSelection(dataset.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-slate-100 text-lg">{dataset.name}</CardTitle>
                    <CardDescription className="text-slate-400 mt-1">
                      {dataset.data.length.toLocaleString()} records
                    </CardDescription>
                  </div>

                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDatasetSelect?.(dataset)
                      }}
                      className="text-slate-400 hover:text-slate-200 h-8 w-8 p-0"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Export dataset
                        const blob = new Blob([JSON.stringify(dataset.data, null, 2)], {
                          type: "application/json",
                        })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement("a")
                        a.href = url
                        a.download = `${dataset.name}.json`
                        a.click()
                        URL.revokeObjectURL(url)
                      }}
                      className="text-slate-400 hover:text-green-400 h-8 w-8 p-0"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteDataset(dataset)
                      }}
                      className="text-slate-400 hover:text-red-400 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getTypeColor(dataset.type)}>{dataset.type}</Badge>

                    {dataset.normalized && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Normalized</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(dataset.createdAt || "").toLocaleDateString()}</span>
                  </div>

                  {dataset.fileName && (
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <FileText className="h-4 w-4" />
                      <span className="truncate">{dataset.fileName}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
