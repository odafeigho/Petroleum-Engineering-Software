import type { GuideTranslations } from "../types"

export const it: GuideTranslations = {
  common: {
    loading: "Caricamento...",
    error: "Errore",
    success: "Successo",
    warning: "Avviso",
    info: "Informazione",
    print: "Stampa",
    download: "Scarica",
    expand: "Espandi",
    collapse: "Comprimi",
    next: "Successivo",
    previous: "Precedente",
    home: "Home",
    tableOfContents: "Indice",
    selectLanguage: "Seleziona Lingua",
    languageSupport: "Supporto Linguistico",
    languagesAvailable: "Questa applicazione è disponibile in 9 lingue",
    viewUserGuide: "Visualizza Guida Utente",
  },
  home: {
    title: "Armonizzatore di Dati di Giacimento",
    description:
      "Pulisce, formatta e integra automaticamente dati di giacimento multi-formato in un modello unificato utilizzando algoritmi avanzati di normalizzazione",
    tabs: {
      upload: "Caricamento Dati",
      preview: "Anteprima Dati",
      normalize: "Normalizzazione",
      integrate: "Integrazione",
      algorithm: "Algoritmo",
    },
    errors: {
      noDatasets: "Si prega di caricare almeno un set di dati prima",
      beforeNormalization: "Si prega di caricare almeno un set di dati prima della normalizzazione",
      beforeIntegration: "Si prega di normalizzare i set di dati prima dell'integrazione",
    },
  },
  guide: {
    title: "Armonizzatore di Dati di Giacimento - Guida Utente",
    description:
      "Guida completa passo dopo passo per armonizzare dati eterogenei di giacimento utilizzando algoritmi avanzati di normalizzazione",
    overview: {
      title: "Panoramica",
      gettingStarted: {
        title: "Iniziare",
        description: "Comprendere il flusso di lavoro e i concetti fondamentali",
        whatIs: {
          title: "Cos'è l'Armonizzazione dei Dati?",
          description:
            "L'armonizzazione dei dati è il processo di riunire dati da diverse fonti, formati e scale in un formato unificato e coerente che consente un'analisi completa.",
        },
        whyImportant: {
          title: "Perché è Importante?",
          description:
            "Nell'ingegneria dei giacimenti, i dati provengono da varie fonti (log, sismici, produzione) con diverse scale e unità. L'armonizzazione consente analisi trasversali e migliori decisioni.",
        },
      },
      coreAlgorithm: {
        title: "Algoritmo Principale",
        description: "L'applicazione utilizza un processo in due fasi: Normalizzazione seguita da Integrazione",
      },
      workflow: {
        steps: {
          upload: {
            title: "Carica Dati",
            description: "Aggiungi i tuoi set di dati eterogenei",
          },
          preview: {
            title: "Anteprima e Validazione",
            description: "Rivedi la qualità e la struttura dei dati",
          },
          normalize: {
            title: "Normalizza",
            description: "Applica la normalizzazione statistica",
          },
          integrate: {
            title: "Integra",
            description: "Crea un modello unificato",
          },
        },
      },
    },
    upload: {
      title: "Caricamento Dati",
      description: "Impara come aggiungere i tuoi set di dati di giacimento all'armonizzatore",
      supportedTypes: {
        title: "Tipi di Dati Supportati",
        wellLogs: {
          label: "Log di Pozzo",
          description: "Misurazioni di raggi gamma, resistività, porosità",
        },
        seismic: {
          label: "Dati Sismici",
          description: "Dati di ampiezza, frequenza, velocità",
        },
        production: {
          label: "Dati di Produzione",
          description: "Tassi di olio/gas/acqua, letture di pressione",
        },
        core: {
          label: "Analisi di Carote",
          description: "Dati di permeabilità, porosità, saturazione",
        },
      },
      instructions: {
        title: "Istruzioni Passo dopo Passo",
        step1: {
          title: "Inserisci Nome del Set di Dati",
          description: 'Scegli un nome descrittivo (es., "Log-Pozzo-A", "Produzione-Campo-X")',
        },
        step2: {
          title: "Seleziona Tipo di Dati",
          description: "Scegli la categoria appropriata per i tuoi dati",
        },
        step3: {
          title: "Genera Set di Dati di Esempio",
          description: "Clicca per creare un set di dati di esempio per dimostrazione",
        },
      },
      exampleWorkflow: {
        title: "Flusso di Lavoro di Esempio",
        description:
          "Per un'analisi completa, carica almeno 2-3 tipi diversi di dati. Ad esempio: Log di pozzo + Dati di produzione + Analisi di carote per una caratterizzazione completa del giacimento.",
      },
    },
    faq: {
      title: "Domande Frequenti",
      description: "Domande comuni sull'Armonizzatore di Dati di Giacimento",
      questions: {
        dataTypes: {
          question: "D: Quali tipi di dati di giacimento posso armonizzare?",
          answer:
            "R: L'applicazione supporta quattro tipi principali di dati di giacimento: Log di Pozzo (raggi gamma, resistività, porosità), Dati Sismici (ampiezza, frequenza, velocità), Dati di Produzione (tassi di olio/gas/acqua, pressione), e Analisi di Carote (permeabilità, porosità, saturazione). Ogni tipo viene elaborato secondo le pratiche standard dell'industria.",
        },
        normalization: {
          question: "D: Perché è necessaria la normalizzazione dei dati?",
          answer:
            "R: Diverse misurazioni di giacimento hanno scale vastamente diverse (es., porosità: 0-1, pressione: 1000-5000 psi). Senza normalizzazione, le misurazioni su scala maggiore dominerebbero l'analisi. La normalizzazione mette tutti i dati sulla stessa scala (media=0, dev std=1), consentendo confronto equo e integrazione.",
        },
        accuracy: {
          question: "D: Quanto è accurato l'algoritmo di normalizzazione?",
          answer:
            "R: L'applicazione utilizza la formula standard di normalizzazione Z-score (d-μ)/σ, che è matematicamente precisa e ampiamente accettata nell'analisi statistica. L'algoritmo gestisce casi limite come deviazione standard zero e valori mancanti per garantire risultati robusti.",
        },
        security: {
          question: "D: I miei dati sono sicuri quando uso questa applicazione?",
          answer:
            "R: Sì, tutta l'elaborazione dei dati avviene localmente nel tuo browser. Nessun dato viene trasmesso a server esterni. I tuoi dati di giacimento rimangono completamente privati e sicuri sul tuo dispositivo durante tutto il processo di armonizzazione.",
        },
      },
    },
    glossary: {
      title: "Glossario Tecnico",
      description: "Definizioni di termini e concetti tecnici",
      reservoirTerms: {
        title: "Termini di Ingegneria dei Giacimenti",
        porosity: {
          term: "Porosità",
          definition:
            "La percentuale di spazio vuoto nella roccia che può contenere fluidi. Essenziale per calcolare le riserve di idrocarburi.",
        },
        permeability: {
          term: "Permeabilità",
          definition:
            "Una misura della capacità della roccia di trasmettere fluidi, tipicamente misurata in millidarcy (mD).",
        },
        resistivity: {
          term: "Resistività",
          definition:
            "Resistenza elettrica delle formazioni rocciose, utilizzata per distinguere tra formazioni contenenti idrocarburi e quelle contenenti acqua.",
        },
      },
      dataScienceTerms: {
        title: "Termini di Scienza dei Dati",
        normalization: {
          term: "Normalizzazione",
          definition:
            "Tecnica statistica per scalare i dati in un intervallo standard, tipicamente con media=0 e deviazione standard=1.",
        },
        standardDeviation: {
          term: "Deviazione Standard (σ)",
          definition:
            "Una misura della dispersione o variabilità dei dati attorno alla media. Utilizzata nella normalizzazione per scalare i dati proporzionalmente.",
        },
        zScore: {
          term: "Normalizzazione Z-Score",
          definition:
            "La formula specifica di normalizzazione: (valore - media) / deviazione_standard. Risulta in dati con media=0 e dev std=1.",
        },
      },
    },
    troubleshooting: {
      title: "Guida alla Risoluzione dei Problemi",
      description: "Problemi comuni e soluzioni",
      problems: {
        noDatasets: {
          problem: "Nessun set di dati disponibile per l'anteprima",
          cause: "Nessun set di dati è stato caricato",
          solution: "Vai alla scheda Caricamento e aggiungi almeno un set di dati",
        },
        notNormalized: {
          problem: "Si prega di normalizzare i set di dati prima dell'integrazione",
          cause: "Tentativo di integrazione senza normalizzazione",
          solution: "Completa prima il passaggio di normalizzazione",
        },
        missingValues: {
          problem: "Trovati X valori mancanti",
          cause: "Il set di dati contiene valori vuoti o non validi",
          solution: 'Utilizza il pulsante "Pulisci Tutti i Set di Dati" per gestire automaticamente i valori mancanti',
        },
      },
      bestPractices: {
        title: "Migliori Pratiche per il Successo",
        items: [
          "Visualizza sempre i tuoi dati prima della normalizzazione",
          "Utilizza le funzionalità di pulizia dei dati per risultati migliori",
          "Assicurati che i set di dati abbiano intervalli di profondità o periodi di tempo sovrapposti",
          "Inizia con 2-3 set di dati prima di aggiungere dati più complessi",
          "Esporta e fai il backup del tuo modello unificato dopo l'integrazione",
        ],
      },
    },
    print: {
      title: "Guida Utente Stampabile",
      description: "Scarica o stampa una versione PDF completa della guida utente",
      whatsIncluded: {
        title: "Cosa è Incluso",
        items: [
          "Flusso di lavoro completo passo dopo passo",
          "Formule matematiche e spiegazioni",
          "Domande frequenti",
          "Glossario tecnico",
          "Guida alla risoluzione dei problemi",
          "Migliori pratiche ed esempi",
        ],
      },
      formatFeatures: {
        title: "Caratteristiche del Formato",
        items: [
          "Layout PDF professionale",
          "Sezioni codificate a colori",
          "Formule matematiche",
          "Esempi e suggerimenti",
          "Indice",
          "Formattazione facile da leggere",
        ],
      },
      printTips: {
        title: "Suggerimenti per la Stampa",
        items: [
          'Utilizza l\'opzione "Stampa su PDF" nel tuo browser per i migliori risultati',
          'Abilita "Grafica di sfondo" per le sezioni codificate a colori',
          'Seleziona "Altre impostazioni" → "Formato carta: A4" per il layout ottimale',
          'Scegli "Margini: Predefiniti" per la spaziatura appropriata',
        ],
      },
    },
  },
}
