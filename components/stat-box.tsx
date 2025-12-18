import { AssetIllustration } from "./asset-illustration"

interface StatBoxProps {
  label: string
  value: string
  percentage?: string
  assetStatus?: string
  assetType?: string
  bgColor?: string
}

export function StatBox({
  label,
  value,
  percentage,
  assetStatus = "ready",
  assetType = "drone",
  bgColor = "bg-slate-900/30",
}: StatBoxProps) {
  const bgColorMap: Record<string, string> = {
    ready: "bg-emerald-950/20",
    warning: "bg-amber-950/20",
    maintenance: "bg-cyan-950/20",
    critical: "bg-red-950/20",
    inactive: "bg-slate-800/20",
  }

  const actualBgColor = bgColorMap[assetStatus] || bgColor

  return (
    <div className={`border border-slate-700/50 rounded-xl p-5 ${actualBgColor} backdrop-blur-sm`}>
      <p className="text-sm text-gray-400 mb-3">{label}</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          {percentage && (
            <p
              className={`text-xs mt-1 font-medium ${
                assetStatus === "ready"
                  ? "text-emerald-400"
                  : assetStatus === "warning"
                    ? "text-amber-400"
                    : assetStatus === "maintenance"
                      ? "text-cyan-400"
                      : assetStatus === "critical"
                        ? "text-red-400"
                        : "text-gray-400"
              }`}
            >
              {percentage}
            </p>
          )}
        </div>
        <div className="opacity-70">
          <AssetIllustration color={assetStatus} status={assetStatus.toUpperCase()} assetType={assetType} />
        </div>
      </div>
    </div>
  )
}

// import { AssetIllustration } from "./asset-illustration"

// interface StatBoxProps {
//   label: string
//   value: string
//   percentage?: string
//   assetStatus: string
//   assetType: string
// }

// export function StatBox({ label, value, percentage, assetStatus, assetType }: StatBoxProps) {
//   const statusColorMap: Record<string, { border: string; label: string; percentage: string }> = {
//     ready: {
//       border: "border-emerald-500/30",
//       label: "text-emerald-400",
//       percentage: "text-emerald-400",
//     },
//     warning: {
//       border: "border-amber-500/30",
//       label: "text-amber-400",
//       percentage: "text-amber-400",
//     },
//     maintenance: {
//       border: "border-amber-500/30",
//       label: "text-amber-400",
//       percentage: "text-amber-400",
//     },
//     critical: {
//       border: "border-red-500/30",
//       label: "text-red-400",
//       percentage: "text-red-400",
//     },
//     offline: {
//       border: "border-slate-500/30",
//       label: "text-slate-400",
//       percentage: "text-slate-400",
//     },
//     inactive: {
//       border: "border-gray-500/30",
//       label: "text-gray-400",
//       percentage: "text-gray-400",
//     },
//   }

//   const colorScheme = statusColorMap[assetStatus.toLowerCase()] || statusColorMap.offline

//   return (
//     <div className={`bg-slate-900/40 border ${colorScheme.border} rounded-lg p-6 transition-all hover:bg-slate-800/60`}>
//       <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider">{label}</p>

//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-3xl font-bold text-white mb-1">{value}</p>
//           {percentage && <p className={`text-sm font-semibold ${colorScheme.percentage}`}>{percentage}</p>}
//         </div>

//         {/* Asset Illustration */}
//         <div className="flex-shrink-0 opacity-80">
//           <AssetIllustration 
//             assetType={assetType} 
//             color={assetStatus} 
//             status={assetStatus}
//             size="md"
//           />
//         </div>
//       </div>
//     </div>
//   )
// }
