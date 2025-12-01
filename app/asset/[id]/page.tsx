"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { AssetIllustration } from "@/components/asset-illustration"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface AssetData {
  id: string
  name: string
  modelName: string
  status: string
  color: string
  lastUpdated: string
  assetOverview: {
    status: string
    base: string
    engineHours: number
    missionsCompleted: number
    lastMaintenance: string
    nextMaintenanceDue: string
    firmwareVersion: string
  }
  overallHealth: {
    percentage: number
    score: number
    totalScore: number
    estimatedRemainingFlightLife: string
  }
  batteryTrend: Array<{ time: string; battery: number; voltage: number }>
  faultTrends: Array<{ name: string; percentage: number }>
  recentAlerts: Array<{ level: string; message: string }>
  maintenanceHistory: Array<{
    caseId: string
    faultCode: string
    component: string
    failureMode: string
    dateReported: string
    technician: string
    riskScore: string
    status: string
  }>
  recentFlightLogs: Array<{ date: string; duration: string; details: string }>
  predictiveInsights: {
    estimatedRemainingFlightLife: string
    predictedNextFaultType: string
    confidenceScore: string
  }
}

export default function AssetDetailPage() {
  const params = useParams()
  const router = useRouter()
  const assetId = params.id as string
  const [asset, setAsset] = useState<AssetData | null>(null)
  const [loading, setLoading] = useState(true)
  const [allAssets, setAllAssets] = useState<AssetData[]>([])
  const [assetType, setAssetType] = useState("drone")

  useEffect(() => {
    const fetchAssetData = async () => {
      try {
        const response = await fetch("/assets-data.json")
        const data = await response.json()

        const assets = data.assets
        setAllAssets(assets)
        setAssetType(data.assetType)

        const found = assets.find((a: AssetData) => a.id === assetId)
        if (found) {
          setAsset(found)
        }
      } catch (error) {
        console.error("Error loading asset data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssetData()
  }, [assetId])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!asset) {
    return <div className="flex items-center justify-center h-screen">Asset not found</div>
  }

  const statusColorMap: Record<string, { main: string; bg: string; text: string }> = {
    ready: { main: "#10b981", bg: "bg-emerald-950/20", text: "text-emerald-400" },
    warning: { main: "#f59e0b", bg: "bg-amber-950/20", text: "text-amber-400" },
    maintenance: { main: "#06b6d4", bg: "bg-cyan-950/20", text: "text-cyan-400" },
    critical: { main: "#ef4444", bg: "bg-red-950/20", text: "text-red-400" },
    inactive: { main: "#6b7280", bg: "bg-gray-950/20", text: "text-gray-400" },
    offline: { main: "#4b5563", bg: "bg-slate-950/20", text: "text-slate-400" },
  }

  const colorScheme = statusColorMap[asset.color.toLowerCase()] || statusColorMap.offline

  const currentIdx = allAssets.findIndex((a) => a.id === assetId)
  const canGoPrev = currentIdx > 0
  const canGoNext = currentIdx < allAssets.length - 1

  const handlePrevious = () => {
    if (canGoPrev) {
      router.push(`/asset/${allAssets[currentIdx - 1].id}`)
    }
  }

  const handleNext = () => {
    if (canGoNext) {
      router.push(`/asset/${allAssets[currentIdx + 1].id}`)
    }
  }

  const healthColors = ["#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#10b981"]
  const getHealthColor = (percentage: number) => {
    if (percentage >= 80) return healthColors[5]
    if (percentage >= 60) return healthColors[4]
    if (percentage >= 40) return healthColors[3]
    if (percentage >= 20) return healthColors[2]
    return healthColors[0]
  }

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 overflow-auto bg-slate-950">
        {/* Header with Status */}
        <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900/50 to-transparent p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-white">
                    {assetType.charAt(0).toUpperCase() + assetType.slice(1)}: {asset.id}
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${colorScheme.bg} ${colorScheme.text}`}
                  >
                    {asset.assetOverview.status === "Operational" ? "Operational" : asset.assetOverview.status}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">Last Updated: {asset.lastUpdated}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                </svg>
                Send Maintenance Request
              </button>
              <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-semibold transition-colors">
                Mark Inactive
              </button>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors">
                View Logs
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Asset Overview Card */}
          <div className="border border-slate-800 rounded-xl bg-slate-900/30 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Asset Overview</h2>

            <div className="grid grid-cols-4 gap-6">
              {/* Asset Illustration */}
              <div className="col-span-1 flex flex-col items-center justify-center">
                <AssetIllustration
                  color={asset.color.toLowerCase()}
                  status={asset.assetOverview.status}
                  assetType={assetType}
                />
                <p className="text-sm text-gray-400 mt-3 text-center">Model: {asset.modelName}</p>
                <p className="text-lg font-bold text-white mt-1">ID: {asset.id}</p>
              </div>

              {/* Overview Grid */}
              <div className="col-span-3">
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Status</p>
                    <p className="text-lg font-semibold" style={{ color: colorScheme.main }}>
                      {asset.assetOverview.status}
                    </p>
                  </div>
                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Base</p>
                    <p className="text-lg font-semibold text-white">{asset.assetOverview.base}</p>
                  </div>
                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Engine Hours</p>
                    <p className="text-lg font-semibold text-white">{asset.assetOverview.engineHours}</p>
                  </div>
                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Flight Hours</p>
                    <p className="text-lg font-semibold text-white">{asset.assetOverview.engineHours * 1.2}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Missions Completed</p>
                    <p className="text-lg font-semibold text-white">{asset.assetOverview.missionsCompleted}</p>
                  </div>
                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Last Maintenance</p>
                    <p className="text-lg font-semibold text-white">{asset.assetOverview.lastMaintenance}</p>
                  </div>
                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Next Maintenance Due</p>
                    <p className="text-lg font-semibold text-white">{asset.assetOverview.nextMaintenanceDue}</p>
                  </div>
                  <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Firmware Version</p>
                    <p className="text-lg font-semibold text-white">{asset.assetOverview.firmwareVersion}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Health and Charts Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Overall Health */}
            <div className="border border-slate-800 rounded-xl bg-slate-900/30 p-6">
              <h3 className="text-lg font-bold text-white mb-6">Overall Health</h3>
              <div className="flex items-center gap-8">
                <div className="flex-1">
                  <svg viewBox="0 0 200 200" className="w-40 h-40">
                    <circle cx="100" cy="100" r="90" fill="none" stroke="#374151" strokeWidth="20" />
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke={getHealthColor(asset.overallHealth.percentage)}
                      strokeWidth="20"
                      strokeDasharray={`${(asset.overallHealth.percentage / 100) * 565.5} 565.5`}
                      strokeLinecap="round"
                      style={{ transform: "rotate(-90deg)", transformOrigin: "100px 100px" }}
                    />
                    <text x="100" y="95" textAnchor="middle" className="text-4xl font-bold" fill="white">
                      {asset.overallHealth.percentage}%
                    </text>
                    <text x="100" y="115" textAnchor="middle" className="text-xs" fill="#9ca3af">
                      {asset.overallHealth.score}/{asset.overallHealth.totalScore}
                    </text>
                  </svg>
                </div>
                <div className="text-sm text-gray-400">
                  <p>
                    Estimated Remaining Service Life:{" "}
                    <span className="text-red-400 font-semibold">
                      {asset.overallHealth.estimatedRemainingFlightLife}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Battery & Voltage Trend */}
            <div className="border border-slate-800 rounded-xl bg-slate-900/30 p-6">
              <h3 className="text-lg font-bold text-white mb-6">Battery & Voltage Trend (Last 7)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={asset.batteryTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="battery" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="voltage" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fault Trends and Recent Alerts Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Fault Trends */}
            <div className="border border-slate-800 rounded-xl bg-slate-900/30 p-6">
              <h3 className="text-lg font-bold text-white mb-6">Fault Trends</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={asset.faultTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="percentage" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Alerts */}
            <div className="border border-slate-800 rounded-xl bg-slate-900/30 p-6">
              <h3 className="text-lg font-bold text-white mb-6">Recent Alerts</h3>
              <div className="space-y-3">
                {asset.recentAlerts.length > 0 ? (
                  asset.recentAlerts.map((alert, idx) => (
                    <div key={idx} className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <svg
                            className={`w-5 h-5 ${alert.level === "High" ? "text-red-500" : "text-yellow-500"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" />
                          </svg>
                          <span
                            className={`text-sm font-semibold ${alert.level === "High" ? "text-red-400" : "text-yellow-400"}`}
                          >
                            {alert.level} Priority
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mt-2">{alert.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No active alerts</p>
                )}
              </div>
            </div>
          </div>

          {/* Maintenance & Fault History Table */}
          <div className="border border-slate-800 rounded-xl bg-slate-900/30 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Maintenance & Fault History</h3>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search units..."
                  className="px-3 py-2 bg-slate-800/30 border border-slate-700 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500"
                />
                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors">
                  Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Case ID</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Fault Code</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Component</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Failure Mode</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date Reported</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Technician...</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Risk Score</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {asset.maintenanceHistory.map((record, idx) => (
                    <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-white">{record.caseId}</td>
                      <td className="py-3 px-4 text-gray-300">{record.faultCode}</td>
                      <td className="py-3 px-4 text-gray-300">{record.component}</td>
                      <td className="py-3 px-4 text-gray-300">{record.failureMode}</td>
                      <td className="py-3 px-4 text-gray-300">{record.dateReported}</td>
                      <td className="py-3 px-4 text-gray-300">{record.technician}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            record.riskScore === "High"
                              ? "bg-orange-950/50 text-orange-400"
                              : record.riskScore === "Critical"
                                ? "bg-red-950/50 text-red-400"
                                : "bg-gray-950/50 text-gray-400"
                          }`}
                        >
                          {record.riskScore}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            record.status === "Closed"
                              ? "bg-emerald-950/50 text-emerald-400"
                              : record.status === "In Progress"
                                ? "bg-blue-950/50 text-blue-400"
                                : "bg-slate-950/50 text-slate-400"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Predictive Insights */}
          <div className="border border-slate-800 rounded-xl bg-slate-900/30 p-6">
            <h3 className="text-lg font-bold text-white mb-6">Predictive Insights</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Estimated Remaining Service Life</p>
                <p
                  className="text-2xl font-bold"
                  style={{
                    color: getHealthColor(Number.parseInt(asset.predictiveInsights.estimatedRemainingFlightLife)),
                  }}
                >
                  {asset.predictiveInsights.estimatedRemainingFlightLife}
                </p>
              </div>

              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Predicted Next Fault Type</p>
                <p className="text-lg font-semibold text-white">{asset.predictiveInsights.predictedNextFaultType}</p>
              </div>

              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Confidence Score</p>
                <p className="text-lg font-semibold text-white">{asset.predictiveInsights.confidenceScore}</p>
              </div>
            </div>
          </div>

          {/* Navigation and Footer */}
          <div className="flex items-center justify-between mt-10 border-t border-slate-800 pt-6">
            <button
              onClick={handlePrevious}
              disabled={!canGoPrev}
              className="px-4 py-2 hover:bg-slate-800/50 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <span className="text-sm text-gray-500">
              Asset {currentIdx + 1} of {allAssets.length}
            </span>

            <button
              onClick={handleNext}
              disabled={!canGoNext}
              className="px-4 py-2 hover:bg-slate-800/50 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors text-sm flex items-center gap-2"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-800 bg-slate-900/30 p-4 flex items-center justify-between text-xs text-gray-500 mt-8">
            <div className="flex gap-8">
              <span>Signal-IQ v2.1.3</span>
              <a href="#" className="text-blue-400 hover:text-blue-300">
                Support
              </a>
            </div>
            <span>© 2025 Fleet Operations Center</span>
          </div>
        </div>
      </main>
    </div>
  )
}
