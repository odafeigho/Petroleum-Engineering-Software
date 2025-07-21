import type { DataSet } from "../app/page"

/**
 * Validates a dataset for completeness and data quality
 * @param dataset The dataset to validate
 * @returns An object containing validation results
 */
export function validateDataset(dataset: DataSet) {
  const results = {
    isValid: true,
    missingValues: 0,
    outOfRangeValues: 0,
    duplicateRecords: 0,
    messages: [] as string[],
  }

  if (!dataset.data || dataset.data.length === 0) {
    results.isValid = false
    results.messages.push("Dataset is empty")
    return results
  }

  // Get all numeric fields
  const firstRecord = dataset.data[0]
  const numericFields = Object.keys(firstRecord).filter((key) => typeof firstRecord[key] === "number")

  // Check for missing values
  dataset.data.forEach((record) => {
    numericFields.forEach((field) => {
      const value = record[field]
      if (value === undefined || value === null || (typeof value === "number" && isNaN(value))) {
        results.missingValues++
      }
    })
  })

  if (results.missingValues > 0) {
    results.messages.push(`Found ${results.missingValues} missing values`)
  }

  // Check for out-of-range values (using simple statistical outlier detection)
  numericFields.forEach((field) => {
    const values = dataset.data.map((record) => record[field]).filter((val) => typeof val === "number" && !isNaN(val))

    if (values.length > 0) {
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length
      const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length)

      // Consider values outside 3 standard deviations as outliers
      const outliers = values.filter((val) => Math.abs(val - mean) > 3 * stdDev)
      results.outOfRangeValues += outliers.length
    }
  })

  if (results.outOfRangeValues > 0) {
    results.messages.push(`Found ${results.outOfRangeValues} potential outliers`)
  }

  // Check for duplicate records (simplified check)
  const recordSignatures = new Set()
  dataset.data.forEach((record) => {
    const signature = JSON.stringify(
      Object.entries(record)
        .filter(([key]) => key !== "id")
        .sort(([a], [b]) => a.localeCompare(b)),
    )

    if (recordSignatures.has(signature)) {
      results.duplicateRecords++
    } else {
      recordSignatures.add(signature)
    }
  })

  if (results.duplicateRecords > 0) {
    results.messages.push(`Found ${results.duplicateRecords} potential duplicate records`)
  }

  // Set overall validity
  results.isValid = results.missingValues === 0 && results.outOfRangeValues === 0

  return results
}

/**
 * Validates the unified model for consistency
 * @param unifiedModel The unified model to validate
 * @returns Validation results
 */
export function validateUnifiedModel(unifiedModel: any[]) {
  const results = {
    isValid: true,
    incompleteRecords: 0,
    messages: [] as string[],
  }

  if (!unifiedModel || unifiedModel.length === 0) {
    results.isValid = false
    results.messages.push("Unified model is empty")
    return results
  }

  // Check for required fields
  const requiredFields = ["timestamp", "depth", "source", "dataType"]

  unifiedModel.forEach((record) => {
    const missingFields = requiredFields.filter((field) => !record[field])
    if (missingFields.length > 0) {
      results.incompleteRecords++
    }
  })

  if (results.incompleteRecords > 0) {
    results.messages.push(`Found ${results.incompleteRecords} incomplete records`)
    results.isValid = false
  }

  return results
}
