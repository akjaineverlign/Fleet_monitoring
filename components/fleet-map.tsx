"use client"

import { useState } from "react"

interface Base {
  id: string
  name: string
  drones: number
  latitude: number
  longitude: number
  region: string
}

const bases: Base[] = [
  { id: "B-1", name: "Base-1", drones: 125, latitude: 40.7128, longitude: -74.006, region: "New York" },
  { id: "B-2", name: "Base-2", drones: 98, latitude: 34.0522, longitude: -118.2437, region: "Los Angeles" },
  { id: "B-3", name: "Base-3", drones: 110, latitude: 41.8781, longitude: -87.6298, region: "Chicago" },
  { id: "B-4", name: "Base-4", drones: 102, latitude: 29.7604, longitude: -95.3698, region: "Houston" },
  { id: "B-5", name: "Base-5", drones: 115, latitude: 33.749, longitude: -84.388, region: "Atlanta" },
  { id: "B-6", name: "Base-6", drones: 88, latitude: 47.6062, longitude: -122.3321, region: "Seattle" },
  { id: "B-7", name: "Base-7", drones: 120, latitude: 37.7749, longitude: -122.4194, region: "San Francisco" },
  { id: "B-8", name: "Base-8", drones: 95, latitude: 39.7392, longitude: -104.9903, region: "Denver" },
  { id: "B-9", name: "Base-9", drones: 105, latitude: 36.1627, longitude: -115.1348, region: "Las Vegas" },
  { id: "B-10", name: "Base-10", drones: 92, latitude: 33.4484, longitude: -112.074, region: "Phoenix" },
  { id: "B-11", name: "Base-11", drones: 118, latitude: 38.5816, longitude: -121.494, region: "Sacramento" },
  { id: "B-12", name: "Base-12", drones: 100, latitude: 40.758, longitude: -73.9855, region: "Manhattan" },
  { id: "B-13", name: "Base-13", drones: 87, latitude: 42.3314, longitude: -83.0458, region: "Detroit" },
  { id: "B-14", name: "Base-14", drones: 110, latitude: 28.5421, longitude: -81.3723, region: "Orlando" },
  { id: "B-15", name: "Base-15", drones: 99, latitude: 31.7461, longitude: -106.4426, region: "El Paso" },
  { id: "B-16", name: "Base-16", drones: 108, latitude: 35.1264, longitude: -106.5565, region: "Albuquerque" },
  { id: "B-17", name: "Base-17", drones: 97, latitude: 39.7684, longitude: -104.9878, region: "Aurora" },
]

export function FleetMap() {
  const [hoveredBase, setHoveredBase] = useState<string | null>(null)
  const [selectedBase, setSelectedBase] = useState<string | null>(null)

  const getPosition = (latitude: number, longitude: number) => {
    const x = ((longitude + 180) / 360) * 100
    const y = ((90 - latitude) / 180) * 100
    return { x, y }
  }

  const maxDrones = Math.max(...bases.map((b) => b.drones))
  const minDrones = Math.min(...bases.map((b) => b.drones))
  const totalDrones = bases.reduce((sum, b) => sum + b.drones, 0)

  const getMarkerSize = (drones: number) => {
    const normalized = (drones - minDrones) / (maxDrones - minDrones)
    return 16 + normalized * 32
  }

  return (
    <div className="bg-gradient-to-br from-slate-900/50 via-slate-900/30 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Global Fleet Distribution</h2>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-cyan-400/70 animate-pulse"></div>
          <span className="text-xs text-cyan-300">Live</span>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full bg-gradient-to-br from-slate-800/40 via-slate-900/60 to-slate-900/40 rounded-lg border border-slate-700/50 overflow-hidden h-96 shadow-2xl">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient mesh background */}
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

        {/* Connecting lines between bases */}
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
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
                  opacity="0.1"
                />
              )
            }
          })}
        </svg>

        {/* Base Markers */}
        <div className="absolute inset-0 pointer-events-none">
          {bases.map((base) => {
            const pos = getPosition(base.latitude, base.longitude)
            const size = getMarkerSize(base.drones)
            const isHovered = hoveredBase === base.id
            const isSelected = selectedBase === base.id

            return (
              <div
                key={base.id}
                className="absolute pointer-events-auto"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseEnter={() => setHoveredBase(base.id)}
                onMouseLeave={() => setHoveredBase(null)}
                onClick={() => setSelectedBase(isSelected ? null : base.id)}
              >
                {/* Outer glow ring */}
                <div
                  className={`absolute rounded-full transition-all duration-300 ${
                    isHovered || isSelected ? "ring-2 ring-cyan-300/60 bg-cyan-400/20" : "bg-cyan-500/10"
                  }`}
                  style={{
                    width: `${size * 2}px`,
                    height: `${size * 2}px`,
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) ${isHovered ? "scale(1.3)" : isSelected ? "scale(1.15)" : ""}`,
                  }}
                />

                {/* Middle pulse ring */}
                <div
                  className="absolute rounded-full border border-cyan-400/40"
                  style={{
                    width: `${size * 1.5}px`,
                    height: `${size * 1.5}px`,
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    animation: isHovered ? "pulse 2s infinite" : "none",
                  }}
                />

                {/* Main marker */}
                <div
                  className={`absolute rounded-full flex items-center justify-center font-bold text-white cursor-pointer transition-all duration-300 shadow-lg ${
                    isHovered || isSelected
                      ? "bg-gradient-to-br from-cyan-400 to-cyan-500 shadow-cyan-400/50 text-slate-900"
                      : "bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-cyan-500/30 text-white"
                  }`}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: "50%",
                    top: "50%",
                    marginLeft: `-${size / 2}px`,
                    marginTop: `-${size / 2}px`,
                    fontSize: `${Math.max(10, size / 3)}px`,
                  }}
                >
                  {base.drones}
                </div>

                {/* Base Label - Tooltip */}
                {(isHovered || isSelected) && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 whitespace-nowrap z-20 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg px-4 py-3 shadow-2xl">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                        <div className="font-bold text-white text-sm">{base.name}</div>
                      </div>
                      <div className="text-xs text-gray-400 mb-1">{base.region}</div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-cyan-300 font-semibold">{base.drones}</span>
                        <span className="text-gray-500">drones</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1.5 pt-1.5 border-t border-slate-700">
                        Lat: {base.latitude.toFixed(3)}°, Lon: {base.longitude.toFixed(3)}°
                      </div>
                    </div>
                  </div>
                )}

                {/* Base Label - Always visible at location */}
                <div
                  className="absolute text-center pointer-events-none transition-opacity duration-300"
                  style={{
                    top: `${size / 2 + 8}px`,
                    left: "50%",
                    transform: "translateX(-50%)",
                    opacity: isHovered || isSelected ? 1 : 0.6,
                  }}
                >
                  <div className="text-xs font-bold text-cyan-300 bg-slate-900/60 px-2 py-0.5 rounded backdrop-blur-sm border border-slate-700/30">
                    {base.name}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Statistics Footer */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800/40 transition-colors">
          <div className="text-xs text-gray-400 mb-2 font-semibold">Total Bases</div>
          <div className="text-2xl font-bold text-cyan-400">{bases.length}</div>
          <div className="text-xs text-gray-500 mt-1">Operational</div>
        </div>
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800/40 transition-colors">
          <div className="text-xs text-gray-400 mb-2 font-semibold">Total Assets</div>
          <div className="text-2xl font-bold text-cyan-400">{totalDrones}</div>
          <div className="text-xs text-gray-500 mt-1">Fleet-wide</div>
        </div>
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800/40 transition-colors">
          <div className="text-xs text-gray-400 mb-2 font-semibold">Avg per Base</div>
          <div className="text-2xl font-bold text-cyan-400">{Math.round(totalDrones / bases.length)}</div>
          <div className="text-xs text-gray-500 mt-1">Distribution</div>
        </div>
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800/40 transition-colors">
          <div className="text-xs text-gray-400 mb-2 font-semibold">Highest Base</div>
          <div className="text-2xl font-bold text-cyan-400">{Math.max(...bases.map((b) => b.drones))}</div>
          <div className="text-xs text-gray-500 mt-1">Max capacity</div>
        </div>
      </div>
    </div>
  )
}
