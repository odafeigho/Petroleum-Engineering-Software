"use client"

import { useEffect, useCallback } from "react"
import { notificationService, type ProcessingNotification } from "../lib/notifications/notification-service"

interface UseProcessingNotificationsOptions {
  enabled?: boolean
  datasetName?: string
}

export function useProcessingNotifications(options: UseProcessingNotificationsOptions = {}) {
  const { enabled = true, datasetName } = options

  useEffect(() => {
    // Request notification permission on first use
    if (enabled && notificationService.getPermissionStatus() === "default") {
      notificationService.requestPermission()
    }
  }, [enabled])

  const notifyUploadStart = useCallback(
    (dataset: string) => {
      if (!enabled) return

      notificationService.showProcessingNotification({
        type: "upload",
        stage: "Upload Started",
        message: `Starting upload of ${dataset}`,
        timestamp: Date.now(),
        datasetName: dataset,
      })
    },
    [enabled],
  )

  const notifyUploadComplete = useCallback(
    (dataset: string) => {
      if (!enabled) return

      notificationService.showProcessingNotification({
        type: "success",
        stage: "Upload Complete",
        message: `Successfully uploaded ${dataset}`,
        timestamp: Date.now(),
        datasetName: dataset,
      })
    },
    [enabled],
  )

  const notifyNormalizationStart = useCallback(
    (datasetCount: number) => {
      if (!enabled) return

      notificationService.showProcessingNotification({
        type: "normalize",
        stage: "Normalization Started",
        message: `Starting normalization of ${datasetCount} dataset${datasetCount > 1 ? "s" : ""}`,
        timestamp: Date.now(),
        progress: 0,
      })
    },
    [enabled],
  )

  const notifyNormalizationProgress = useCallback(
    (progress: number, currentDataset?: string) => {
      if (!enabled) return

      notificationService.showProcessingNotification({
        type: "normalize",
        stage: "Normalizing Data",
        message: currentDataset ? `Processing ${currentDataset}` : "Processing datasets",
        timestamp: Date.now(),
        progress,
        datasetName: currentDataset,
      })
    },
    [enabled],
  )

  const notifyNormalizationComplete = useCallback(
    (datasetCount: number) => {
      if (!enabled) return

      notificationService.showProcessingNotification({
        type: "success",
        stage: "Normalization Complete",
        message: `Successfully normalized ${datasetCount} dataset${datasetCount > 1 ? "s" : ""}`,
        timestamp: Date.now(),
      })
    },
    [enabled],
  )

  const notifyIntegrationStart = useCallback(
    (datasetCount: number) => {
      if (!enabled) return

      notificationService.showProcessingNotification({
        type: "integrate",
        stage: "Integration Started",
        message: `Starting integration of ${datasetCount} normalized dataset${datasetCount > 1 ? "s" : ""}`,
        timestamp: Date.now(),
      })
    },
    [enabled],
  )

  const notifyIntegrationComplete = useCallback(
    (recordCount: number) => {
      if (!enabled) return

      notificationService.showProcessingNotification({
        type: "success",
        stage: "Integration Complete",
        message: `Successfully created unified model with ${recordCount} records`,
        timestamp: Date.now(),
      })
    },
    [enabled],
  )

  const notifyExportStart = useCallback(
    (format: string) => {
      if (!enabled) return

      notificationService.showProcessingNotification({
        type: "export",
        stage: "Export Started",
        message: `Starting export to ${format.toUpperCase()} format`,
        timestamp: Date.now(),
      })
    },
    [enabled],
  )

  const notifyExportComplete = useCallback(
    (filename: string) => {
      if (!enabled) return

      notificationService.showProcessingNotification({
        type: "export",
        stage: "Export Complete",
        message: `Successfully exported data to ${filename}`,
        timestamp: Date.now(),
      })
    },
    [enabled],
  )

  const notifyError = useCallback(
    (stage: string, error: string, dataset?: string) => {
      if (!enabled) return

      notificationService.showProcessingNotification({
        type: "error",
        stage,
        message: error,
        timestamp: Date.now(),
        datasetName: dataset,
      })
    },
    [enabled],
  )

  const notifyCustom = useCallback(
    (notification: Omit<ProcessingNotification, "timestamp">) => {
      if (!enabled) return

      notificationService.showProcessingNotification({
        ...notification,
        timestamp: Date.now(),
      })
    },
    [enabled],
  )

  return {
    notifyUploadStart,
    notifyUploadComplete,
    notifyNormalizationStart,
    notifyNormalizationProgress,
    notifyNormalizationComplete,
    notifyIntegrationStart,
    notifyIntegrationComplete,
    notifyExportStart,
    notifyExportComplete,
    notifyError,
    notifyCustom,
  }
}
