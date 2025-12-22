export interface Case {
  caseId: string
  assetNumber: string
  assetId: string
  assetType: string
  assetName: string
  component: string
  failureMode: string
  dateReported: string
  riskScore: string
  severity: "CRITICAL" | "HIGH" | "MED" | "LOW"
  status: "UNDER REVIEW" | "CLOSED" | "IN PROGRESS"
  base: string
  timeAgo: string
  numericRiskScore: number
}

export function generateCasesFromAssets(assets: any[]): Case[] {
  const cases: Case[] = []

  assets.forEach((asset: any) => {
    // Generate cases from maintenance history
    if (asset.maintenanceHistory && asset.maintenanceHistory.length > 0) {
      asset.maintenanceHistory.forEach((history: any) => {
        const severity = mapRiskToSeverity(history.riskScore)
        const timeAgo = calculateTimeAgo(history.dateReported)

        cases.push({
          caseId:
            history.caseId ||
            `${asset.id.substring(0, 3).toUpperCase()}001-${String(cases.length + 1).padStart(4, "0")}`,
          assetNumber: asset.id,
          assetId: asset.id,
          assetType: asset.name,
          assetName: asset.name,
          component: history.component,
          failureMode: history.failureMode,
          dateReported: history.dateReported,
          riskScore: history.riskScore,
          severity: severity,
          status: history.status === "Closed" ? "CLOSED" : "UNDER REVIEW",
          base: asset.assetOverview.base,
          timeAgo: timeAgo,
          numericRiskScore: calculateNumericRiskScore(severity),
        })
      })
    }

    // Generate cases from recent alerts
    if (asset.recentAlerts && asset.recentAlerts.length > 0) {
      asset.recentAlerts.forEach((alert: any) => {
        const severity = mapAlertLevelToSeverity(alert.level)

        cases.push({
          caseId: `${asset.id.substring(0, 3).toUpperCase()}001-${String(cases.length + 1).padStart(4, "0")}`,
          assetNumber: asset.id,
          assetId: asset.id,
          assetType: asset.name,
          assetName: asset.name,
          component: extractComponent(alert.message),
          failureMode: alert.message,
          dateReported: new Date().toISOString().split("T")[0],
          riskScore: severity === "CRITICAL" ? "High" : severity === "HIGH" ? "High" : "Medium",
          severity: severity,
          status: "UNDER REVIEW",
          base: asset.assetOverview.base,
          timeAgo: "2 min ago",
          numericRiskScore: calculateNumericRiskScore(severity),
        })
      })
    }
  })

  return cases.sort((a, b) => b.numericRiskScore - a.numericRiskScore)
}

function mapRiskToSeverity(riskScore: string): "CRITICAL" | "HIGH" | "MED" | "LOW" {
  if (riskScore === "High") return "CRITICAL"
  if (riskScore === "Critical") return "CRITICAL"
  if (riskScore === "Medium") return "HIGH"
  return "MED"
}

function mapAlertLevelToSeverity(level: string): "CRITICAL" | "HIGH" | "MED" | "LOW" {
  if (level === "High Priority" || level === "High") return "CRITICAL"
  if (level === "Medium Priority" || level === "Medium") return "HIGH"
  return "MED"
}

function calculateNumericRiskScore(severity: string): number {
  switch (severity) {
    case "CRITICAL":
      return 90 + Math.random() * 10
    case "HIGH":
      return 70 + Math.random() * 15
    case "MED":
      return 40 + Math.random() * 20
    default:
      return 20 + Math.random() * 15
  }
}

function calculateTimeAgo(dateReported: string): string {
  const reportDate = new Date(dateReported)
  const now = new Date()
  const diffMs = now.getTime() - reportDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "1 day ago"
  if (diffDays < 30) return `${diffDays} days ago`
  if (diffDays < 60) return "1 month ago"
  return `${Math.floor(diffDays / 30)} months ago`
}

function extractComponent(message: string): string {
  if (message.toLowerCase().includes("motor") || message.toLowerCase().includes("engine")) return "Motor / Drive Unit"
  if (message.toLowerCase().includes("propulsion") || message.toLowerCase().includes("propeller"))
    return "Propulsion System"
  if (message.toLowerCase().includes("gps") || message.toLowerCase().includes("navigation")) return "Navigation System"
  if (message.toLowerCase().includes("sensor")) return "Sensor Array"
  if (message.toLowerCase().includes("comm")) return "Communication Module"
  if (message.toLowerCase().includes("electrical") || message.toLowerCase().includes("bus")) return "Electrical System"
  if (message.toLowerCase().includes("hydraulic")) return "Hydraulic System"
  if (message.toLowerCase().includes("hull") || message.toLowerCase().includes("structural")) return "Hull Structure"
  if (message.toLowerCase().includes("fuel")) return "Fuel System"
  return "General Systems"
}
