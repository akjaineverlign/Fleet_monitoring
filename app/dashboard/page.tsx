"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { FleetMap } from "@/components/fleet-map"

interface Asset {
  id: string
  name: string
  status: string
  color: string
  maintenanceHistory?: Array<{
    caseId: string
    faultCode: string
    component: string
    failureMode: string
    dateReported: string
    technician: string
    riskScore: string
    status: string
  }>
  recentAlerts?: Array<{
    level: string
    message: string
  }>
}

interface DashboardData {
  assets: Asset[]
}

export default function Dashboard() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/assets-data.json")
      .then((res) => res.json())
      .then((data: DashboardData) => {
        setAssets(data.assets)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  // Calculate metrics
  const stats = {
    assetsReady: 68,
    personnelAvailable: 83,
    operationalThreshold: 72,
    supplyChainHealth: 79,
  }

  // Fleet status breakdown
  const operational = assets.filter((a) => a.status === "READY").length
  const maintenance = assets.filter((a) => a.status === "MAINTENANCE").length
  const critical = assets.filter((a) => ["CRITICAL", "ALERT"].includes(a.status)).length
  const inactive = assets.filter((a) => ["INACTIVE", "OFFLINE"].includes(a.status)).length

  const fleetReadinessData = [
    { name: "Operational", value: operational, fill: "#10b981" },
    { name: "Maintenance", value: maintenance, fill: "#f59e0b" },
    { name: "Critical", value: critical, fill: "#ef4444" },
    { name: "Inactive", value: inactive, fill: "#6b7280" },
  ]

  // Fleet status overview (fault types)
  const fleetStatusOverview = [
    { label: "No Fault", count: 27, color: "#10b981" },
    { label: "Motor1 Fault", count: 15, color: "#f97316" },
    { label: "Motor2 Fault", count: 7, color: "#0ea5e9" },
    { label: "GPS Fault", count: 8, color: "#a855f7" },
    { label: "Propeller3 Fault", count: 12, color: "#f59e0b" },
  ]

  // Top risk assets
  const topRiskAssets = assets
    .filter((a) => a.maintenanceHistory && a.maintenanceHistory.length > 0)
    .slice(0, 8)
    .map((asset, idx) => ({
      caseId: asset.maintenanceHistory?.[0]?.caseId || "AFB00" + (idx + 1),
      tailNumber: asset.id,
      aircraftType: asset.name,
      failureMode: asset.maintenanceHistory?.[0]?.failureMode || "Unknown",
      dateReported: asset.maintenanceHistory?.[0]?.dateReported || "2025-10-09",
      riskScore: asset.maintenanceHistory?.[0]?.riskScore || "High",
    }))

  // Recent alerts from assets
  const recentAlerts = assets
    .filter((a) => a.recentAlerts && a.recentAlerts.length > 0)
    .slice(0, 3)
    .map((asset, idx) => ({
      id: idx,
      assetId: asset.id,
      base: "Base-" + (idx + 1),
      alert: asset.recentAlerts?.[0]?.message || "Unknown alert",
      level: asset.recentAlerts?.[0]?.level || "Medium",
    }))

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar currentPage="Dashboard" />

      <main className="flex-1 overflow-auto bg-slate-950">
        {/* Header Section */}
        <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900/50 to-transparent p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Asset Fleets & Readiness</h1>
              <p className="text-sm text-gray-400">
                Consolidated readiness view across MQ-9 Reaper, RQ-4 Global Hawk, MQ-1 Predator, XQ-58 Valkyrie, RQ-11
                Raven Assets and support equipment
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
            { label: "Critical Assets", value: `${stats.personnelAvailable}%` },
            { label: "Predicted Failures", value: `${stats.operationalThreshold}%` },
            { label: "Predicted Unavailable Assets", value: `${stats.supplyChainHealth}%` },
          ].map((metric, idx) => (
            <div
              key={idx}
              className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors"
            >
              <p className="text-xs text-gray-400 mb-2">{metric.label}</p>
              <p className="text-3xl font-bold text-white">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="p-6 space-y-6">
          {/* Top Row: Alerts and Fleet Map */}
          <div className="grid grid-cols-2 gap-6">
            {/* Recent Alerts */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
              <h2 className="text-lg font-bold text-white mb-4">Recent Alerts</h2>
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" />
                        </svg>
                        <span className="text-white font-semibold">
                          {alert.assetId} • {alert.base}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">1m ago</span>
                    </div>
                    <p className="text-sm text-gray-300 ml-7">
                      {alert.level} • {alert.alert.substring(0, 45)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fleet Map */}
            <FleetMap />
          </div>

          {/* Middle Row: Fleet Charts */}
          <div className="grid grid-cols-2 gap-6">
            {/* Fleet Readiness Distribution */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
              <h2 className="text-lg font-bold text-white mb-4">Fleet Readiness Distribution</h2>
              <div className="flex items-center justify-between">
                <ResponsiveContainer width="50%" height={200}>
                  <PieChart>
                    <Pie
                      data={fleetReadinessData}
                      innerRadius={50}
                      outerRadius={80}
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
                <div className="space-y-3">
                  {fleetReadinessData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                        <span className="text-sm text-gray-300">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fleet Status Overview */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
              <h2 className="text-lg font-bold text-white mb-4">Fleet Status Overview</h2>
              <div className="space-y-3">
                {fleetStatusOverview.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-gray-300">{item.label}</span>
                    </div>
                    <span className="text-lg font-semibold text-white">{item.count}</span>
                  </div>
                ))}
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
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Tail Number</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Aircraft Type</th>
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
                      <td className="py-3 px-4 text-gray-300">{asset.tailNumber}</td>
                      <td className="py-3 px-4 text-gray-300">{asset.aircraftType}</td>
                      <td className="py-3 px-4 text-gray-300 max-w-xs truncate">{asset.failureMode}</td>
                      <td className="py-3 px-4 text-gray-300">{asset.dateReported}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            asset.riskScore === "High"
                              ? "bg-red-500/20 text-red-400"
                              : asset.riskScore === "Critical"
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {asset.riskScore}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
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
            <span>SignalIQ v2.1.3</span>
            <a href="#" className="text-blue-400 hover:text-blue-300">
              Support
            </a>
          </div>
          <span>© 2025 Fleet Operations Center</span>
        </div>
      </main>
    </div>
  )
}
