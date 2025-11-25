"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AssetIllustration } from "./asset-illustration"

interface AssetCardProps {
  id: string
  name: string
  status: string
  color: string
  assetType?: string
}

export function AssetCard({ id, name, status, color, assetType = "drone" }: AssetCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  const statusColors: Record<string, { borderColor: string; textColor: string; dotColor: string }> = {
    ready: { borderColor: "#10b981", textColor: "#10b981", dotColor: "#10b981" },
    warning: { borderColor: "#f59e0b", textColor: "#f59e0b", dotColor: "#f59e0b" },
    maintenance: { borderColor: "#06b6d4", textColor: "#06b6d4", dotColor: "#06b6d4" },
    critical: { borderColor: "#ef4444", textColor: "#ef4444", dotColor: "#ef4444" },
    inactive: { borderColor: "#6b7280", textColor: "#6b7280", dotColor: "#6b7280" },
    offline: { borderColor: "#4b5563", textColor: "#4b5563", dotColor: "#4b5563" },
    alert: { borderColor: "#ef4444", textColor: "#ef4444", dotColor: "#ef4444" },
  }

  const colorConfig = statusColors[color.toLowerCase()] || statusColors.offline

  const handleClick = () => {
    router.push(`/asset/${id}`)
  }

  return (
    <div
      className={`relative rounded-xl p-5 cursor-pointer transition-all duration-300 backdrop-blur-sm ${
        isHovered ? "bg-slate-900/50 scale-105" : "bg-slate-950/40"
      }`}
      style={{
        border: `2px solid ${colorConfig.borderColor}`,
        borderOpacity: "0.6",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Status Indicator Dot */}
      <div className="absolute top-4 right-4 w-3 h-3 rounded-full" style={{ backgroundColor: colorConfig.dotColor }} />

      {/* Asset Name */}
      <h3 className="text-sm font-semibold text-white mb-1">{name}</h3>

      {/* Asset ID */}
      <p className="text-xs text-gray-500 mb-5">{id}</p>

      {/* Asset Icon */}
      <div className="mb-5 flex justify-center">
        <AssetIllustration color={color.toLowerCase()} status={status} assetType={assetType} />
      </div>

      {/* Status Label */}
      <div className="text-center text-xs font-bold uppercase tracking-widest" style={{ color: colorConfig.textColor }}>
        {status}
      </div>
    </div>
  )
}
