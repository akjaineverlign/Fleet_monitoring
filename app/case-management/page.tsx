"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { ProtectedRoute } from "@/components/protected-route"
import { useRouter } from "next/navigation"
import { generateCasesFromAssets } from "@/lib/case-utils"

function CaseManagementPage() {
  const [cases, setCases] = useState([])
  const [selectedCase, setSelectedCase] = useState(null)
  const [filterTab, setFilterTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch("/assets-data.json")
      .then((res) => res.json())
      .then((data) => {
        const generatedCases = generateCasesFromAssets(data.assets)
        setCases(generatedCases)
        if (generatedCases.length > 0) {
          setSelectedCase(generatedCases[0])
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.assetId.toLowerCase().includes(searchQuery.toLowerCase())

    if (filterTab === "critical") return matchesSearch && c.severity === "CRITICAL"
    if (filterTab === "warning") return matchesSearch && (c.severity === "HIGH" || c.severity === "MED")
    return matchesSearch
  })

  const criticalCount = cases.filter((c) => c.severity === "CRITICAL").length
  const warningCount = cases.filter((c) => c.severity === "HIGH" || c.severity === "MED").length

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center h-screen">Loading...</div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-slate-950">
        <Sidebar />

        <main className="flex-1 overflow-hidden bg-slate-950">
          {/* Header */}
          <div className="border-b border-slate-800 p-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Operational Case Management</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">Last Synced: 2025-12-22 14:05 UTC</span>
              <button className="relative p-2.5 hover:bg-slate-800 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>

          <div className="flex h-[calc(100vh-88px)]">
            {/* Left Sidebar - Case List */}
            <div className="w-96 border-r border-slate-800 overflow-y-auto">
              <div className="p-4 space-y-4">
                {/* Search */}
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search Case ID or Asset..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterTab("critical")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterTab === "critical"
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-slate-800/30 text-gray-400 hover:bg-slate-800"
                    }`}
                  >
                    Critical ({criticalCount})
                  </button>
                  <button
                    onClick={() => setFilterTab("warning")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterTab === "warning"
                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                        : "bg-slate-800/30 text-gray-400 hover:bg-slate-800"
                    }`}
                  >
                    Warning ({warningCount})
                  </button>
                  <button
                    onClick={() => setFilterTab("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterTab === "all"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "bg-slate-800/30 text-gray-400 hover:bg-slate-800"
                    }`}
                  >
                    All ({cases.length})
                  </button>
                </div>

                {/* Case List */}
                <div className="space-y-2">
                  {filteredCases.map((caseItem) => (
                    <button
                      key={caseItem.caseId}
                      onClick={() => setSelectedCase(caseItem)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedCase?.caseId === caseItem.caseId
                          ? "bg-slate-800/50 border-blue-500/50"
                          : "bg-slate-900/30 border-slate-800 hover:bg-slate-800/30"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-bold text-white">{caseItem.assetId}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            caseItem.severity === "CRITICAL"
                              ? "bg-red-500/20 text-red-400"
                              : caseItem.severity === "HIGH"
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {caseItem.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{caseItem.component}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Case: {caseItem.caseId}</span>
                        <span>{caseItem.timeAgo}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content - Case Detail */}
            {selectedCase ? (
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Case Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-white">Case #{selectedCase.caseId}</h2>
                        <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-lg text-xs font-semibold uppercase">
                          {selectedCase.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                          <span>
                            Asset: <span className="text-white font-semibold">{selectedCase.assetId}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span>
                            Base: <span className="text-white font-semibold">{selectedCase.base}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 22h20L12 2zm0 5l7 13H5l7-13z" />
                          </svg>
                          <span>
                            Risk Score: <span className="text-red-400 font-bold">{selectedCase.riskScore}/100</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors">
                        Mark False Positive
                      </button>
                      <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors">
                        Create Work Order (3-M)
                      </button>
                    </div>
                  </div>

                  {/* Sensor Fusion Anomaly Detection */}
                  <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Sensor Fusion Anomaly Detection</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Comparing Actual vs. Predicted (Healthy Model) Behavior
                    </p>

                    {/* Chart Area */}
                    <div className="relative h-64 bg-slate-950/50 rounded-lg p-4 border border-slate-800">
                      <div className="flex items-center justify-between mb-2 text-xs">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-gray-400">Predicted (Model)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="text-gray-400">Actual (Sensor)</span>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs font-semibold">
                          Residual Drift: +18%
                        </div>
                      </div>

                      {/* Simplified Chart Visualization */}
                      <div className="h-48 flex items-end justify-between gap-1">
                        <div className="text-xs text-gray-500 writing-mode-vertical transform -rotate-180 mr-2">
                          Signal Strength
                        </div>
                        <div className="flex-1 h-full relative">
                          <svg viewBox="0 0 400 150" className="w-full h-full">
                            {/* Grid lines */}
                            <line
                              x1="0"
                              y1="37.5"
                              x2="400"
                              y2="37.5"
                              stroke="#334155"
                              strokeWidth="0.5"
                              strokeDasharray="2,2"
                            />
                            <line
                              x1="0"
                              y1="75"
                              x2="400"
                              y2="75"
                              stroke="#334155"
                              strokeWidth="0.5"
                              strokeDasharray="2,2"
                            />
                            <line
                              x1="0"
                              y1="112.5"
                              x2="400"
                              y2="112.5"
                              stroke="#334155"
                              strokeWidth="0.5"
                              strokeDasharray="2,2"
                            />

                            {/* Predicted line (blue, dashed) */}
                            <path
                              d="M0,120 Q100,100 200,90 T400,85"
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="2"
                              strokeDasharray="4,4"
                            />

                            {/* Actual line with area fill (red) */}
                            <path
                              d="M0,120 Q100,105 200,70 T400,60 L400,150 L0,150 Z"
                              fill="rgba(239, 68, 68, 0.2)"
                              stroke="#ef4444"
                              strokeWidth="2"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>Mission Start (T-2h)</span>
                        <span>Cruising Speed (35 kts)</span>
                        <span>Mission End (Now)</span>
                      </div>
                    </div>
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Everlign AI Assessment */}
                    <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-purple-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">Everlign AI Assessment</h3>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            Analysis of telemetry from Mission 163 indicates a progressive drift in propeller shaft
                            vibration matching the signature of a{" "}
                            <span className="text-red-400 font-semibold">mechanical imbalance</span> rather than sensor
                            error. The residual gap widens significantly at RPMs &gt; 2500, suggesting a coupler issue.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Probable Root Cause */}
                    <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Probable Root Cause (SBA)</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-300">Shaft Coupler Misalignment</span>
                            <span className="text-sm font-bold text-red-400">88%</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500" style={{ width: "88%" }}></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Matched 4 historical failure signatures.</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-300">Propeller Blade Damage</span>
                            <span className="text-sm font-bold text-orange-400">12%</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500" style={{ width: "12%" }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-300">Gearbox Sensor Fault</span>
                            <span className="text-sm font-bold text-gray-500">0%</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gray-500" style={{ width: "0%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Supply Chain & Repair */}
                  <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Supply Chain & Repair</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="text-sm">
                          <span className="text-gray-400 block mb-1">RECOMMENDED PART</span>
                          <div className="flex items-center justify-between">
                            <span className="text-white font-semibold">Coupler Assy, 45mm</span>
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                              In Stock
                            </span>
                          </div>
                          <span className="text-gray-500 text-xs">P/N: 4492-CS-45</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400 block mb-1">Location</span>
                            <span className="text-white font-semibold">{selectedCase.base} (On Site)</span>
                          </div>
                          <div>
                            <span className="text-gray-400 block mb-1">Quantity</span>
                            <span className="text-white font-semibold">2 Units Available</span>
                          </div>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-400 block mb-1">Est. Repair Time</span>
                          <span className="text-white font-semibold">4 Man Hours</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <button className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                          Reserve Part & Schedule
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">Select a case to view details</div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default CaseManagementPage
