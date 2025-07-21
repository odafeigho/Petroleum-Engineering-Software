"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, X, CheckCircle, AlertCircle, Database } from "lucide-react"
import { useI18n } from "../../lib/i18n/context"
import type { DataSet } from "../page"

interface DataUploadProps {
  datasets: DataSet[]
  setDatasets: (datasets: DataSet[]) => void
}

interface UploadFile {
  id: string
  file: File
  progress: number
  status: "uploading" | "complete" | "error"
  type: "logs" | "seismic" | "production" | "core"
}

export function DataUpload({ datasets, setDatasets }: DataUploadProps) {
  const { t } = useI18n()
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }, [])

  const handleFiles = (files: File[]) => {
    const newUploadFiles: UploadFile[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: "uploading" as const,
      type: getFileType(file.name),
    }))

    setUploadFiles((prev) => [...prev, ...newUploadFiles])

    // Simulate upload process
    newUploadFiles.forEach((uploadFile) => {
      simulateUpload(uploadFile)
    })
  }

  const getFileType = (fileName: string): "logs" | "seismic" | "production" | "core" => {
    const name = fileName.toLowerCase()
    if (name.includes("log") || name.includes("well")) return "logs"
    if (name.includes("seismic") || name.includes("seis")) return "seismic"
    if (name.includes("production") || name.includes("prod")) return "production"
    return "core"
  }

  const simulateUpload = (uploadFile: UploadFile) => {
    const interval = setInterval(() => {
      setUploadFiles((prev) =>
        prev.map((file) => {
          if (file.id === uploadFile.id) {
            const newProgress = Math.min(file.progress + Math.random() * 20, 100)
            if (newProgress >= 100) {
              clearInterval(interval)
              // Add to datasets
              const newDataset: DataSet = {
                id: file.id,
                name: file.file.name,
                type: file.type,
                data: generateMockData(file.type),
              }
              setDatasets([...datasets, newDataset])
              return { ...file, progress: 100, status: "complete" as const }
            }
            return { ...file, progress: newProgress }
          }
          return file
        }),
      )
    }, 500)
  }

  const generateMockData = (type: string) => {
    const baseData = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      depth: 1000 + i * 10,
      value: Math.random() * 100,
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    }))

    switch (type) {
      case "logs":
        return baseData.map((item) => ({
          ...item,
          gamma: Math.random() * 150,
          resistivity: Math.random() * 1000,
          porosity: Math.random() * 0.3,
        }))
      case "seismic":
        return baseData.map((item) => ({
          ...item,
          amplitude: Math.random() * 2 - 1,
          frequency: Math.random() * 100,
          phase: Math.random() * 360,
        }))
      case "production":
        return baseData.map((item) => ({
          ...item,
          oil_rate: Math.random() * 1000,
          gas_rate: Math.random() * 5000,
          water_rate: Math.random() * 500,
        }))
      default:
        return baseData.map((item) => ({
          ...item,
          permeability: Math.random() * 1000,
          porosity: Math.random() * 0.4,
          saturation: Math.random(),
        }))
    }
  }

  const removeFile = (id: string) => {
    setUploadFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

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
      {/* Upload Area */}
      <Card className="petroleum-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Database className="h-5 w-5" />
            {t.upload.title}
          </CardTitle>
          <CardDescription className="text-slate-400">{t.upload.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? "border-blue-500 bg-blue-500/10"
                : "border-slate-600/50 hover:border-slate-500/70 hover:bg-slate-800/30"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-200 mb-2">{t.upload.dragDrop}</p>
            <p className="text-sm text-slate-400 mb-4">{t.upload.supportedFormats}</p>
            <p className="text-xs text-slate-500 mb-4">{t.upload.maxFileSize}</p>
            <input
              type="file"
              multiple
              accept=".csv,.xlsx,.json,.xml"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button className="petroleum-button cursor-pointer">{t.upload.selectFiles}</Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadFiles.length > 0 && (
        <Card className="petroleum-card">
          <CardHeader>
            <CardTitle className="text-slate-100">{t.upload.fileDetails}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploadFiles.map((uploadFile) => (
              <div key={uploadFile.id} className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-lg">
                <FileText className="h-8 w-8 text-slate-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-slate-200 truncate">{uploadFile.file.name}</p>
                    <Badge className={`text-xs ${getTypeColor(uploadFile.type)}`}>
                      {t.upload.datasetType[uploadFile.type]}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">
                    {formatFileSize(uploadFile.file.size)} • {uploadFile.file.type || "Unknown type"}
                  </p>
                  {uploadFile.status === "uploading" && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>{t.upload.uploading}</span>
                        <span>{Math.round(uploadFile.progress)}%</span>
                      </div>
                      <Progress value={uploadFile.progress} className="h-2" />
                    </div>
                  )}
                  {uploadFile.status === "complete" && (
                    <div className="flex items-center gap-1 text-green-400 text-sm">
                      <CheckCircle className="h-4 w-4" />
                      {t.upload.uploadComplete}
                    </div>
                  )}
                  {uploadFile.status === "error" && (
                    <div className="flex items-center gap-1 text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {t.upload.uploadFailed}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(uploadFile.id)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Uploaded Datasets Summary */}
      {datasets.length > 0 && (
        <Card className="petroleum-card">
          <CardHeader>
            <CardTitle className="text-slate-100">Uploaded Datasets</CardTitle>
            <CardDescription className="text-slate-400">
              {datasets.length} dataset{datasets.length !== 1 ? "s" : ""} ready for processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {datasets.map((dataset) => (
                <div key={dataset.id} className="p-4 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-slate-200 truncate">{dataset.name}</span>
                  </div>
                  <Badge className={`text-xs ${getTypeColor(dataset.type)}`}>
                    {t.upload.datasetType[dataset.type]}
                  </Badge>
                  <p className="text-sm text-slate-400 mt-2">{dataset.data.length} records</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
