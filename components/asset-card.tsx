// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { AssetIllustration } from "./asset-illustration"

// interface AssetCardProps {
//   id: string
//   name: string
//   status: string
//   color: string
//   assetType?: string
// }

// export function AssetCard({ id, name, status, color, assetType = "drone" }: AssetCardProps) {
//   const [isHovered, setIsHovered] = useState(false)
//   const router = useRouter()

//   const statusColors: Record<string, { borderColor: string; textColor: string; dotColor: string }> = {
//     ready: { borderColor: "#10b981", textColor: "#10b981", dotColor: "#10b981" },
//     warning: { borderColor: "#f59e0b", textColor: "#f59e0b", dotColor: "#f59e0b" },
//     maintenance: { borderColor: "#06b6d4", textColor: "#06b6d4", dotColor: "#06b6d4" },
//     critical: { borderColor: "#ef4444", textColor: "#ef4444", dotColor: "#ef4444" },
//     inactive: { borderColor: "#6b7280", textColor: "#6b7280", dotColor: "#6b7280" },
//     offline: { borderColor: "#4b5563", textColor: "#4b5563", dotColor: "#4b5563" },
//     alert: { borderColor: "#ef4444", textColor: "#ef4444", dotColor: "#ef4444" },
//   }

//   const colorConfig = statusColors[color.toLowerCase()] || statusColors.offline

//   const handleClick = () => {
//     router.push(`/asset/${id}`)
//   }

//   return (
//     <div
//       className={`relative rounded-xl p-5 cursor-pointer transition-all duration-300 backdrop-blur-sm ${
//         isHovered ? "bg-slate-900/50 scale-105" : "bg-slate-950/40"
//       }`}
//       style={{
//         border: `2px solid ${colorConfig.borderColor}`,
//         borderOpacity: "0.6",
//       }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       onClick={handleClick}
//     >
//       {/* Status Indicator Dot */}
//       <div className="absolute top-4 right-4 w-3 h-3 rounded-full" style={{ backgroundColor: colorConfig.dotColor }} />

//       {/* Asset Name */}
//       <h3 className="text-sm font-semibold text-white mb-1">{name}</h3>

//       {/* Asset ID */}
//       <p className="text-xs text-gray-500 mb-5">{id}</p>

//       {/* Asset Icon */}
//       <div className="mb-5 flex justify-center">
//         <AssetIllustration color={color.toLowerCase()} status={status} assetType={assetType} />
//       </div>

//       {/* Status Label */}
//       <div className="text-center text-xs font-bold uppercase tracking-widest" style={{ color: colorConfig.textColor }}>
//         {status}
//       </div>
//     </div>
//   )
// }
"use client"

import { useRouter } from "next/navigation"
import { AssetIllustration } from "./asset-illustration"

interface AssetCardProps {
  id: string
  name: string
  status: string
  color: string
  assetType: string
}

export function AssetCard({ id, name, status, color, assetType }: AssetCardProps) {
  const router = useRouter()

  const statusColorMap: Record<string, { border: string; dot: string; text: string; bg: string }> = {
    ready: {
      border: "border-emerald-500/30",
      dot: "bg-emerald-500",
      text: "text-emerald-400",
      bg: "group-hover:bg-emerald-500/5",
    },
    warning: {
      border: "border-amber-500/30",
      dot: "bg-amber-500",
      text: "text-amber-400",
      bg: "group-hover:bg-amber-500/5",
    },
    maintenance: {
      border: "border-amber-500/30",
      dot: "bg-amber-500",
      text: "text-amber-400",
      bg: "group-hover:bg-amber-500/5",
    },
    critical: {
      border: "border-red-500/30",
      dot: "bg-red-500",
      text: "text-red-400",
      bg: "group-hover:bg-red-500/5",
    },
    offline: {
      border: "border-slate-500/30",
      dot: "bg-slate-500",
      text: "text-slate-400",
      bg: "group-hover:bg-slate-500/5",
    },
    inactive: {
      border: "border-gray-500/30",
      dot: "bg-gray-500",
      text: "text-gray-400",
      bg: "group-hover:bg-gray-500/5",
    },
  }

  const colorScheme = statusColorMap[color.toLowerCase()] || statusColorMap.offline

  const handleClick = () => {
    router.push(`/asset/${id}`)
  }

  return (
    <div
      onClick={handleClick}
      className={`group relative bg-slate-900/40 border ${colorScheme.border} rounded-lg p-4 cursor-pointer transition-all duration-300 hover:bg-slate-800/60 hover:border-opacity-60 ${colorScheme.bg}`}
    >
      {/* Status Dot */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white line-clamp-1">{name}</h3>
        <div className={`w-2.5 h-2.5 rounded-full ${colorScheme.dot} shadow-lg shadow-current`}></div>
      </div>

      {/* Asset ID */}
      <p className="text-sm text-gray-500 mb-4">{id}</p>

      {/* Illustration */}
      <div className="flex justify-center mb-4">
        <AssetIllustration assetType={assetType} color={color} status={status} size="md" />
      </div>

      {/* Status text centered */}
      <p className={`text-xs font-semibold text-center ${colorScheme.text} uppercase tracking-widest`}>
        {status === "READY" ? "READY" : status === "MAINTENANCE" ? "MAINTENANCE" : status === "CRITICAL" ? "CRITICAL" : "OFFLINE"}
      </p>
    </div>
  )
}
