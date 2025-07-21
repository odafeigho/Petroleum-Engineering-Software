import type { DataSet } from "../app/page"

/**
 * Cleans a dataset by handling missing values and outliers
 * @param dataset The dataset to clean
 * @returns A cleaned copy of the dataset
 */
export function cleanDataset(dataset: DataSet): DataSet {
  if (!dataset.data || dataset.data.length === 0) {
    return dataset
  }

  // Get all numeric fields
  const firstRecord = dataset.data[0]
  const numericFields = Object.keys(firstRecord).filter((key) => typeof firstRecord[key] === "number")

  // Calculate field statistics for imputation
  const fieldStats = numericFields.reduce(
    (stats, field) => {
      const values = dataset.data.map((record) => record[field]).filter((val) => typeof val === "number" && !isNaN(val))

      if (values.length > 0) {
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length
        const median = [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]

        stats[field] = { mean, median }
      }

      return stats
    },
    {} as Record<string, { mean: number; median: number }>,
  )

  // Clean the data
  const cleanedData = dataset.data.map((record) => {
    const cleanedRecord = { ...record }

    numericFields.forEach((field) => {
      const value = record[field]

      // Handle missing or NaN values
      if (value === undefined || value === null || (typeof value === "number" && isNaN(value))) {
        // Use median for imputation (more robust than mean)
        if (fieldStats[field]) {
          cleanedRecord[field] = fieldStats[field].median
        }
      }
    })

    return cleanedRecord
  })

  return {
    ...dataset,
    data: cleanedData,
  }
}

/**
 * Removes duplicate records from a dataset
 * @param dataset The dataset to deduplicate
 * @returns A deduplicated copy of the dataset
 */
export function deduplicateDataset(dataset: DataSet): DataSet {
  if (!dataset.data || dataset.data.length === 0) {
    return dataset
  }

  // Use a Map to track unique records
  const uniqueRecords = new Map()

  dataset.data.forEach((record) => {
    // Create a signature excluding the ID field
    const signature = JSON.stringify(
      Object.entries(record)
        .filter(([key]) => key !== "id")
        .sort(([a], [b]) => a.localeCompare(b)),
    )

    // Only keep the first occurrence of each unique record
    if (!uniqueRecords.has(signature)) {
      uniqueRecords.set(signature, record)
    }
  })

  return {
    ...dataset,
    data: Array.from(uniqueRecords.values()),
  }
}
