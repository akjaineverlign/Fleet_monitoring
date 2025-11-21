"use client"

interface DroneIllustrationProps {
  color: string
  status: string
  size?: "sm" | "md" | "lg"
}

export function DroneIllustration({ color, status, size = "md" }: DroneIllustrationProps) {
  const droneImageMap: Record<string, string> = {
    ready: "/drone-operational.png",
    operational: "/drone-operational.png",
    warning: "/drone-maintenance.png",
    maintenance: "/drone-maintenance.png",
    critical: "/drone-critical.png",
    inactive: "/drone-inactive.png",
    offline: "/drone-inactive.png",
    alert: "/drone-critical.png",
  }

  const sizeMap = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  const droneImage = droneImageMap[color.toLowerCase()] || "/drone-operational.png"

  return (
    <img
      src={droneImage || "/placeholder.svg"}
      alt={`Drone - ${status}`}
      className={`${sizeMap[size]} object-contain`}
    />
  )
}
