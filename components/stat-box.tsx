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
      <p className="text-xs text-gray-400 mb-3">{label}</p>
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
