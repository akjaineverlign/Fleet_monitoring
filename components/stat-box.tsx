import { DroneIllustration } from './drone-illustration'

interface StatBoxProps {
  label: string
  value: string
  percentage?: string
  droneStatus?: string
  bgColor?: string
}

export function StatBox({ label, value, percentage, droneStatus = 'ready', bgColor = 'bg-slate-900/30' }: StatBoxProps) {
  const bgColorMap: Record<string, string> = {
    ready: 'bg-emerald-950/20',
    warning: 'bg-amber-950/20',
    maintenance: 'bg-cyan-950/20',
    critical: 'bg-red-950/20',
    inactive: 'bg-slate-800/20',
  }
  
  const actualBgColor = bgColorMap[droneStatus] || bgColor

  return (
    <div className={`border border-slate-700/50 rounded-xl p-5 ${actualBgColor} backdrop-blur-sm`}>
      <p className="text-xs text-gray-400 mb-3">{label}</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          {percentage && (
            <p className={`text-xs mt-1 font-medium ${
              droneStatus === 'ready' ? 'text-emerald-400' :
              droneStatus === 'warning' ? 'text-amber-400' :
              droneStatus === 'maintenance' ? 'text-cyan-400' :
              droneStatus === 'critical' ? 'text-red-400' :
              'text-gray-400'
            }`}>
              {percentage}
            </p>
          )}
        </div>
        <div className="opacity-70">
          <DroneIllustration color={droneStatus} status={droneStatus.toUpperCase()} />
        </div>
      </div>
    </div>
  )
}
