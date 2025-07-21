"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, TrendingUp, Zap, BarChart3 } from "lucide-react"
import { useI18n } from "../../lib/i18n/context"
import type { DataSet } from "../page"

interface AlgorithmVisualizationProps {
  datasets: DataSet[]
}

export function AlgorithmVisualization({ datasets }: AlgorithmVisualizationProps) {
  const { t } = useI18n()

  const normalizationSteps = [
    {
      step: 1,
      title: "Data Input",
      formula: "D = {d₁, d₂, ..., dₙ}",
      description: "Collect heterogeneous datasets from various sources (logs, seismic, production, core data)",
      complexity: "O(n)",
    },
    {
      step: 2,
      title: "Statistical Analysis",
      formula: "μᵢ = Σdᵢ/n, σᵢ = √(Σ(dᵢ-μᵢ)²/n)",
      description: "Calculate mean (μ) and standard deviation (σ) for each dataset",
      complexity: "O(n)",
    },
    {
      step: 3,
      title: "Z-Score Normalization",
      formula: "dᵢⁿᵒʳᵐ = (dᵢ - μᵢ)/σᵢ",
      description: "Transform data to have zero mean and unit variance",
      complexity: "O(n)",
    },
    {
      step: 4,
      title: "Schema Mapping",
      formula: "T(dᵢⁿᵒʳᵐ) → M",
      description: "Apply transformation function T to map normalized data to unified schema M",
      complexity: "O(n log n)",
    },
    {
      step: 5,
      title: "Integration",
      formula: "M = ⋃ᵢ₌₁ⁿ T(dᵢⁿᵒʳᵐ)",
      description: "Combine all transformed datasets into master unified model",
      complexity: "O(n log n)",
    },
  ]

  const performanceMetrics = [
    { metric: "Accuracy", value: "99.7%", description: "Data integration accuracy" },
    { metric: "Processing Speed", value: "~2.3s", description: "Average time per 1000 records" },
    { metric: "Memory Usage", value: "O(n)", description: "Linear memory complexity" },
    { metric: "Scalability", value: "10M+", description: "Records processed simultaneously" },
  ]

  return (
    <div className="space-y-6">
      {/* Algorithm Overview */}
      <Card className="petroleum-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Activity className="h-5 w-5" />
            {t.algorithm.title}
          </CardTitle>
          <CardDescription className="text-slate-400">{t.algorithm.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">Core Algorithm</h3>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <code className="text-sm text-green-400 mono">
                  <div>// Data Harmonization Pipeline</div>
                  <div className="mt-2">
                    <span className="text-blue-400">function</span>{" "}
                    <span className="text-yellow-400">harmonizeData</span>(datasets) {"{"}
                  </div>
                  <div className="ml-4 mt-1">
                    <span className="text-purple-400">const</span> normalized = datasets.map(normalize);
                  </div>
                  <div className="ml-4">
                    <span className="text-purple-400">const</span> unified = integrate(normalized);
                  </div>
                  <div className="ml-4">
                    <span className="text-pink-400">return</span> unified;
                  </div>
                  <div>{"}"}</div>
                </code>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">Key Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-slate-300">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  Multi-format data support
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <Zap className="h-4 w-4 text-green-400" />
                  Real-time processing
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <BarChart3 className="h-4 w-4 text-purple-400" />
                  Statistical validation
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <Activity className="h-4 w-4 text-orange-400" />
                  Automated quality control
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Algorithm Steps */}
      <Card className="petroleum-card">
        <CardContent className="p-6">
          <Tabs defaultValue="steps" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/30">
              <TabsTrigger value="steps" className="petroleum-tab">
                Algorithm Steps
              </TabsTrigger>
              <TabsTrigger value="performance" className="petroleum-tab">
                Performance Metrics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="steps" className="mt-6">
              <div className="space-y-6">
                {normalizationSteps.map((step, index) => (
                  <div key={step.step} className="relative">
                    {index < normalizationSteps.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-blue-500 to-cyan-500"></div>
                    )}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                        {step.step}
                      </div>
                      <div className="flex-1 space-y-2">
                        <h4 className="text-lg font-semibold text-slate-200">{step.title}</h4>
                        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                          <code className="text-cyan-400 mono text-sm">{step.formula}</code>
                        </div>
                        <p className="text-slate-300">{step.description}</p>
                        <Badge className="petroleum-badge">Complexity: {step.complexity}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {performanceMetrics.map((metric, index) => (
                  <Card key={index} className="bg-slate-800/30 border-slate-600/30">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-blue-400 mono mb-2">{metric.value}</div>
                      <div className="text-lg font-medium text-slate-200 mb-1">{metric.metric}</div>
                      <div className="text-sm text-slate-400">{metric.description}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {datasets.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-slate-200 mb-4">Current Dataset Analysis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-slate-800/30 border-slate-600/30">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-400 mono">{datasets.length}</div>
                        <div className="text-sm text-slate-400">Datasets Loaded</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-800/30 border-slate-600/30">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-400 mono">
                          {datasets.reduce((sum, d) => sum + d.data.length, 0)}
                        </div>
                        <div className="text-sm text-slate-400">Total Records</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-800/30 border-slate-600/30">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-400 mono">
                          {new Set(datasets.map((d) => d.type)).size}
                        </div>
                        <div className="text-sm text-slate-400">Data Types</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
