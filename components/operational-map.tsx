"use client"

import { useState } from "react"

interface Base {
  id: string
  name: string
  location: string
  assetCount: number
  latitude: number
  longitude: number
  status: "operational" | "maintenance" | "critical"
  region: string
}

const bases: Base[] = [
  {
    id: "OPLOC-1",
    name: "Naval Station Norfolk",
    location: "Norfolk, VA",
    assetCount: 32,
    latitude: 36.95,
    longitude: -76.32,
    status: "operational",
    region: "Atlantic",
  },
  {
    id: "OPLOC-2",
    name: "Naval Base San Diego",
    location: "San Diego, CA",
    assetCount: 28,
    latitude: 32.71,
    longitude: -117.2,
    status: "operational",
    region: "Pacific",
  },
  {
    id: "OPLOC-3",
    name: "Naval Station Pearl Harbor",
    location: "Honolulu, HI",
    assetCount: 25,
    latitude: 21.36,
    longitude: -157.95,
    status: "operational",
    region: "Pacific",
  },
  {
    id: "OPLOC-4",
    name: "Naval Base Kitsap",
    location: "Bremerton, WA",
    assetCount: 22,
    latitude: 47.64,
    longitude: -122.63,
    status: "operational",
    region: "Pacific",
  },
  {
    id: "OPLOC-5",
    name: "Naval Station Mayport",
    location: "Jacksonville, FL",
    assetCount: 20,
    latitude: 30.38,
    longitude: -81.41,
    status: "operational",
    region: "Atlantic",
  },
  {
    id: "OPLOC-6",
    name: "Naval Base Coronado",
    location: "San Diego, CA",
    assetCount: 18,
    latitude: 32.68,
    longitude: -117.15,
    status: "operational",
    region: "Pacific",
  },
  {
    id: "OPLOC-7",
    name: "Yokosuka Naval Base",
    location: "Yokosuka, Japan",
    assetCount: 26,
    latitude: 35.29,
    longitude: 139.66,
    status: "operational",
    region: "Indo-Pacific",
  },
  {
    id: "OPLOC-8",
    name: "Naval Support Facility Guam",
    location: "Guam",
    assetCount: 19,
    latitude: 13.58,
    longitude: 144.65,
    status: "operational",
    region: "Indo-Pacific",
  },
  {
    id: "OPLOC-9",
    name: "Naval Station Rota",
    location: "Rota, Spain",
    assetCount: 24,
    latitude: 36.84,
    longitude: -6.35,
    status: "operational",
    region: "Mediterranean",
  },
  {
    id: "OPLOC-10",
    name: "Naval Support Activity Bahrain",
    location: "Manama, Bahrain",
    assetCount: 21,
    latitude: 26.16,
    longitude: 50.24,
    status: "operational",
    region: "Middle East",
  },
  {
    id: "OPLOC-11",
    name: "Naval Station Newport",
    location: "Newport, RI",
    assetCount: 17,
    latitude: 41.14,
    longitude: -71.31,
    status: "maintenance",
    region: "Atlantic",
  },
  {
    id: "OPLOC-12",
    name: "Naval Base Groton",
    location: "Groton, CT",
    assetCount: 23,
    latitude: 41.35,
    longitude: -72.08,
    status: "operational",
    region: "Atlantic",
  },
  {
    id: "OPLOC-13",
    name: "Naval Air Station Kingsville",
    location: "Kingsville, TX",
    assetCount: 16,
    latitude: 27.52,
    longitude: -97.86,
    status: "operational",
    region: "Gulf",
  },
  {
    id: "OPLOC-14",
    name: "Naval Station Everett",
    location: "Everett, WA",
    assetCount: 20,
    latitude: 48.03,
    longitude: -122.3,
    status: "operational",
    region: "Pacific",
  },
  {
    id: "OPLOC-15",
    name: "Naval Base Point Loma",
    location: "San Diego, CA",
    assetCount: 19,
    latitude: 32.71,
    longitude: -117.24,
    status: "critical",
    region: "Pacific",
  },
]

export function OperationalMap() {
  const [hoveredBase, setHoveredBase] = useState<string | null>(null)
  const [selectedBase, setSelectedBase] = useState<string | null>(null)

  const totalAssets = bases.reduce((sum, b) => sum + b.assetCount, 0)
  const avgAssetCount = Math.round(totalAssets / bases.length)
  const maxAssetCount = Math.max(...bases.map((b) => b.assetCount))

  const getPosition = (latitude: number, longitude: number) => {
    const x = ((longitude + 180) / 360) * 100
    const y = ((90 - latitude) / 180) * 100
    return { x, y }
  }

  const getMarkerSize = (assetCount: number) => {
    const normalized = (assetCount - 10) / (maxAssetCount - 10)
    return 20 + normalized * 40
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "#10b981"
      case "maintenance":
        return "#f59e0b"
      case "critical":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-900/50 via-slate-900/30 to-slate-900/50 border border-slate-700/50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Global Naval Base Distribution</h2>
          <p className="text-sm text-gray-400 mt-1">US Navy OPLOC (Operational Location) Asset Deployment</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-cyan-400/70 animate-pulse"></div>
          <span className="text-xs text-cyan-300">Live</span>
        </div>
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2">Total Bases</p>
          <p className="text-2xl font-bold text-white">{bases.length}</p>
        </div>
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2">Total Assets</p>
          <p className="text-2xl font-bold text-white">{totalAssets}</p>
        </div>
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2">Average Deployment</p>
          <p className="text-2xl font-bold text-white">{avgAssetCount}</p>
        </div>
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2">Max Capacity</p>
          <p className="text-2xl font-bold text-white">{maxAssetCount}</p>
        </div>
      </div>

      {/* Map Container */}
      <div
        className="relative w-full bg-gradient-to-br from-slate-800/40 via-slate-900/60 to-slate-900/40 rounded-lg border border-slate-700/50 overflow-hidden shadow-2xl bg-cover bg-center"
        style={{ 
          height: "500px",
          // backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/0,20,1.5,0,0/1200x800@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycW1nZXRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw')`,
          backgroundImage: `url('/map-background.png')`,
          backgroundSize: 'cover'
        }}
      >
        {/* Overlay to maintain dark theme */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full filter blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Background Grid */}
        <svg className="absolute inset-0 w-full h-full opacity-5">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Connection lines between bases */}
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {bases.map((base, idx) => {
            if (idx < bases.length - 1) {
              const pos1 = getPosition(base.latitude, base.longitude)
              const pos2 = getPosition(bases[idx + 1].latitude, bases[idx + 1].longitude)
              return (
                <line
                  key={`line-${idx}`}
                  x1={`${pos1.x}%`}
                  y1={`${pos1.y}%`}
                  x2={`${pos2.x}%`}
                  y2={`${pos2.y}%`}
                  stroke="#0ea5e9"
                  strokeWidth="0.5"
                  opacity="0.15"
                />
              )
            }
          })}
        </svg>

        {/* Base Markers */}
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
          {bases.map((base) => {
            const pos = getPosition(base.latitude, base.longitude)
            const size = getMarkerSize(base.assetCount)
            const color = getStatusColor(base.status)
            const isHovered = hoveredBase === base.id
            const isSelected = selectedBase === base.id

            return (
              <g
                key={base.id}
                style={{ pointerEvents: "auto", cursor: "pointer" }}
                onClick={() => setSelectedBase(isSelected ? null : base.id)}
              >
                {/* Outer glow ring */}
                {(isHovered || isSelected) && (
                  <circle
                    cx={`${pos.x}%`}
                    cy={`${pos.y}%`}
                    r={size * 1.5}
                    fill={color}
                    opacity="0.15"
                    style={{ transition: "all 0.3s ease" }}
                  />
                )}

                {/* Middle ring */}
                <circle
                  cx={`${pos.x}%`}
                  cy={`${pos.y}%`}
                  r={size}
                  fill={color}
                  opacity="0.3"
                  style={{ transition: "all 0.3s ease" }}
                />

                {/* Main marker */}
                <circle
                  cx={`${pos.x}%`}
                  cy={`${pos.y}%`}
                  r={size * 0.6}
                  fill={color}
                  opacity="0.9"
                  style={{
                    transition: "all 0.3s ease",
                    filter: isHovered || isSelected ? "drop-shadow(0 0 8px " + color + ")" : "none",
                  }}
                  onMouseEnter={() => setHoveredBase(base.id)}
                  onMouseLeave={() => setHoveredBase(null)}
                />

                {/* Asset count text */}
                <text
                  x={`${pos.x}%`}
                  y={`${pos.y}%`}
                  textAnchor="middle"
                  dy="0.3em"
                  fill="white"
                  fontSize={size * 0.5}
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {base.assetCount}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Tooltip */}
        {hoveredBase && (
          <div className="absolute bottom-4 left-4 bg-slate-800 border border-slate-700 rounded-lg p-4 max-w-xs pointer-events-none">
            {bases.map((base) => {
              if (base.id !== hoveredBase) return null
              return (
                <div key={base.id}>
                  <p className="font-semibold text-white">{base.id}</p>
                  <p className="text-sm text-gray-300">{base.name}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {base.location} | {base.region}
                  </p>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getStatusColor(base.status) }}
                    ></div>
                    <span className="text-xs text-gray-300 capitalize">{base.status}</span>
                    <span className="text-xs font-semibold text-white ml-auto">{base.assetCount} Assets</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Base Details Table */}
      {selectedBase && (
        <div className="mt-6 bg-slate-800/30 border border-slate-700/50 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-800/50 border-b border-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">OPLOC</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Base Name</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Location</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Region</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Assets</th>
                  <th className="px-6 py-3 text-left text-gray-400 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {bases
                  .filter((b) => b.id === selectedBase)
                  .map((base) => (
                    <tr key={base.id} className="border-b border-slate-700/30 hover:bg-slate-800/20">
                      <td className="px-6 py-3 text-white font-semibold">{base.id}</td>
                      <td className="px-6 py-3 text-white">{base.name}</td>
                      <td className="px-6 py-3 text-gray-300">{base.location}</td>
                      <td className="px-6 py-3 text-gray-300">{base.region}</td>
                      <td className="px-6 py-3">
                        <span className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 px-3 py-1 rounded text-xs font-semibold">
                          {base.assetCount}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="inline-flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getStatusColor(base.status) }}
                          ></div>
                          <span className="capitalize text-gray-300">{base.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
