export type SupportedLanguage = "en" | "es" | "fr" | "de" | "zh" | "ar" | "pt" | "ru" | "it" | "xh" | "sa"

export interface LanguageInfo {
  code: SupportedLanguage
  name: string
  nativeName: string
  flag: string
  rtl?: boolean
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: "en", name: "English", nativeName: "English", flag: "/flags/us.png" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "/flags/es.png" },
  { code: "fr", name: "French", nativeName: "Français", flag: "/flags/fr.png" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "/flags/de.png" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "/flags/cn.png" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "/flags/sa.jpeg", rtl: true },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "/flags/pt.png" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "/flags/ru.png" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "/flags/it.png" },
  { code: "xh", name: "Xhosa", nativeName: "isiXhosa", flag: "/flags/za.jpeg" },
  { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्", flag: "/flags/in.png" },
]

export const getLanguageInfo = (code: SupportedLanguage): LanguageInfo => {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code) || SUPPORTED_LANGUAGES[0]
}

export interface Translation {
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    save: string
    delete: string
    edit: string
    view: string
    download: string
    upload: string
    next: string
    previous: string
    close: string
    open: string
    search: string
    filter: string
    sort: string
    export: string
    import: string
    refresh: string
    settings: string
    help: string
    about: string
    contact: string
    home: string
    back: string
    forward: string
    yes: string
    no: string
    ok: string
    apply: string
    reset: string
    clear: string
    select: string
    selectAll: string
    deselectAll: string
    viewUserGuide: string
    print: string
    share: string
    copy: string
    paste: string
    cut: string
    undo: string
    redo: string
  }
  home: {
    title: string
    description: string
    welcome: string
    getStarted: string
    learnMore: string
    features: string
    tabs: {
      upload: string
      preview: string
      normalize: string
      integrate: string
      algorithm: string
    }
    errors: {
      noDatasets: string
      beforeNormalization: string
      beforeIntegration: string
    }
    stats: {
      datasetsProcessed: string
      recordsNormalized: string
      integrationAccuracy: string
      processingTime: string
    }
  }
  upload: {
    title: string
    description: string
    dragDrop: string
    supportedFormats: string
    maxFileSize: string
    selectFiles: string
    uploading: string
    uploadComplete: string
    uploadFailed: string
    removeFile: string
    fileDetails: string
    fileName: string
    fileSize: string
    fileType: string
    lastModified: string
    datasetType: {
      logs: string
      seismic: string
      production: string
      core: string
    }
  }
  preview: {
    title: string
    description: string
    noData: string
    records: string
    columns: string
    dataQuality: string
    missingValues: string
    duplicates: string
    outliers: string
    statistics: string
    mean: string
    median: string
    stdDev: string
    min: string
    max: string
    dataTypes: string
    numeric: string
    text: string
    date: string
    boolean: string
  }
  normalize: {
    title: string
    description: string
    algorithm: string
    zScore: string
    minMax: string
    robust: string
    quantile: string
    startNormalization: string
    normalizing: string
    normalizationComplete: string
    progress: string
    parameters: string
    preview: string
    apply: string
    results: string
    beforeAfter: string
    statistics: string
  }
  integrate: {
    title: string
    description: string
    unifiedModel: string
    integrationMethod: string
    merge: string
    join: string
    union: string
    startIntegration: string
    integrating: string
    integrationComplete: string
    results: string
    totalRecords: string
    successRate: string
    conflicts: string
    exportResults: string
  }
  algorithm: {
    title: string
    description: string
    normalizationFormula: string
    integrationProcess: string
    step: string
    formula: string
    explanation: string
    example: string
    parameters: string
    complexity: string
    accuracy: string
    performance: string
  }
  guide: {
    title: string
    description: string
    tableOfContents: string
    gettingStarted: string
    dataUpload: string
    dataPreview: string
    normalization: string
    integration: string
    troubleshooting: string
    faq: string
    glossary: string
    support: string
    version: string
    lastUpdated: string
    printGuide: string
    downloadPdf: string
    searchGuide: string
  }
  errors: {
    fileNotFound: string
    invalidFormat: string
    fileTooLarge: string
    uploadFailed: string
    processingFailed: string
    networkError: string
    serverError: string
    unknownError: string
    tryAgain: string
    contactSupport: string
  }
  notifications: {
    title: string
    noNotifications: string
    markAllRead: string
    clear: string
    settings: string
    enable: string
    disable: string
    sound: string
    vibration: string
    desktop: string
    email: string
  }
}
