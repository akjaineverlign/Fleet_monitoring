"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { OperationalMap } from "@/components/operational-map"
import { ProtectedRoute } from "@/components/protected-route"
import { generateCasesFromAssets, type Case } from "@/lib/case-utils"

interface Asset {
  id: string
  name: string
  status: string
  color: string
  recentAlerts?: Array<{
    level: string
    message: string
  }>
}

interface AssetsData {
  assets: Asset[]
}

export default function Dashboard() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/assets-data.json")
      .then((res) => res.json())
      .then((data: AssetsData) => {
        setAssets(data.assets)
        const generatedCases = generateCasesFromAssets(data.assets)
        setCases(generatedCases)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center h-screen">Loading...</div>
      </ProtectedRoute>
    )
  }

  // Calculate metrics
  const stats = {
    assetsReady: 65,
    criticalAssets: 12,
    predictedFailures: 24,
    predictedUnavailable: 18,
  }

  // Fleet status breakdown
  const operational = assets.filter((a) => a.status === "READY").length
  const maintenance = assets.filter((a) => a.status === "MAINTENANCE").length
  const critical = assets.filter((a) => a.status === "CRITICAL").length
  const inactive = assets.filter((a) => a.status === "INACTIVE").length

  const fleetReadinessData = [
    { name: "Operational", value: operational, fill: "#10b981" },
    { name: "Maintenance", value: maintenance, fill: "#f59e0b" },
    { name: "Critical", value: critical, fill: "#ef4444" },
    { name: "Inactive", value: inactive, fill: "#6b7280" },
  ]

  // Fleet status overview (fault types)
  const fleetStatusOverview = [
    { label: "No Fault", count: 11, color: "#10b981" },
    { label: "Hydraulic pressure drift", count: 1, color: "#f97316" },
    { label: "Electrical bus instability", count: 2, color: "#0ea5e9" },
    { label: "Propulsion system vibration", count: 2, color: "#a855f7" },
    { label: "Electrical grounding fault", count: 1, color: "#f59e0b" },
  ]

  const topRiskAssets = cases.slice(0, 8)

  const recentAlerts = cases
    .filter((c) => c.status === "UNDER REVIEW")
    .slice(0, 4)
    .map((caseItem, idx) => ({
      id: idx,
      assetId: caseItem.assetId,
      base: caseItem.base,
      alert: caseItem.failureMode,
      level: caseItem.severity === "CRITICAL" ? "High" : caseItem.severity === "HIGH" ? "Medium" : "Low",
    }))

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-slate-950">
        <Sidebar currentPage="Dashboard" />

        <main className="flex-1 overflow-auto bg-slate-950">
          {/* Header Section */}
          <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900/50 to-transparent p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Assets Readiness</h1>
                <p className="text-base text-gray-400">
                  Consolidated readiness view across all assets, bases, and operational environments
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2.5 hover:bg-slate-800 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
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
          </div>

          {/* Metrics Section */}
          <div className="grid grid-cols-4 gap-4 p-6 border-b border-slate-800">
            {[
              { label: "Operational Readiness Rate", value: `${stats.assetsReady}%` },
              { label: "Critical Assets", value: `${stats.criticalAssets}%` },
              { label: "Predicted Failures", value: `${stats.predictedFailures}%` },
              { label: "Predicted Unavailable Assets", value: `${stats.predictedUnavailable}%` },
            ].map((metric, idx) => (
              <div
                key={idx}
                className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors"
              >
                <p className="text-sm text-gray-400 mb-2">{metric.label}</p>
                <p className="text-3xl font-bold text-white">{metric.value}</p>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="p-6 space-y-6">
            {/* Operational Map */}
            <OperationalMap />

            {/* Middle Row: Fleet Charts and Recent Alerts */}
            <div className="grid grid-cols-3 gap-6">
              {/* Fleet Readiness Distribution */}
              <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
                <h2 className="text-lg font-bold text-white mb-4">Fleet Readiness Distribution</h2>

                {/* Legend above chart */}
                <div className="space-y-2 mb-4">
                  {fleetReadinessData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }}></div>
                        <span className="text-sm text-gray-300">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-white">{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Pie Chart */}
                <div className="flex justify-center">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={fleetReadinessData}
                        innerRadius={50}
                        outerRadius={90}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {fleetReadinessData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Fleet Status Overview */}
              <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
                <h2 className="text-lg font-bold text-white mb-4">Fleet Status Overview</h2>
                <div className="space-y-3">
                  {fleetStatusOverview.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm text-gray-300 truncate">{item.label}</span>
                      </div>
                      <span className="text-lg font-semibold text-white ml-2 flex-shrink-0">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Alerts */}
              <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
                <h2 className="text-lg font-bold text-white mb-4">Recent Alerts</h2>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {recentAlerts.length > 0 ? (
                    recentAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 hover:bg-slate-800/70 transition-colors"
                      >
                        <div className="flex items-start gap-2 mb-1">
                          <svg
                            className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" />
                          </svg>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-300 font-semibold truncate">
                              {alert.assetId} - {alert.base}
                            </p>
                            <p className="text-sm text-gray-400 mt-0.5 line-clamp-2">{alert.alert}</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 ml-6">1m ago</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-400">No active alerts</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Row: Top Risk Assets Table */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white">Top Risk Assets</h2>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search units..."
                    className="px-4 py-2 bg-slate-800/30 border border-slate-700 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
                  />
                  <button className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors">
                    Filter
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Case ID</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Asset Number</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Asset Type</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Failure Mode</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date Reported</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Risk Score</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topRiskAssets.map((asset, idx) => (
                      <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 px-4 text-gray-300">{asset.caseId}</td>
                        <td className="py-3 px-4 text-gray-300 font-semibold text-cyan-400">{asset.assetNumber}</td>
                        <td className="py-3 px-4 text-gray-300">{asset.assetType}</td>
                        <td className="py-3 px-4 text-gray-300 max-w-xs truncate">{asset.failureMode}</td>
                        <td className="py-3 px-4 text-gray-300">{asset.dateReported}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              asset.riskScore === "High"
                                ? "bg-red-500/20 text-red-400"
                                : asset.riskScore === "Medium"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {asset.riskScore}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-cyan-400 hover:text-cyan-300 transition-colors text-lg">👁</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-800 bg-slate-900/30 p-4 flex items-center justify-between text-xs text-gray-500 mt-8">
            <div className="flex gap-8">
              <span>Signal-IQ v2.1.3</span>
              <a href="#" className="text-blue-400 hover:text-blue-300">
                Support
              </a>
            </div>
            <span className="text-gray-500">(c) 2025 Fleet Operations Center</span>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
