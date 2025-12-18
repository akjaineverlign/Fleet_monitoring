// "use client"

// interface AssetIllustrationProps {
//   color: string
//   status: string
//   assetType?: string
//   size?: "sm" | "md" | "lg"
// }

// export function AssetIllustration({ color, status, assetType = "drone", size = "md" }: AssetIllustrationProps) {
//   const assetImageMap: Record<string, Record<string, string>> = {
//     drone: {
//       ready: "/drone-operational.png",
//       operational: "/drone-operational.png",
//       warning: "/drone-maintenance.png",
//       maintenance: "/drone-maintenance.png",
//       critical: "/drone-critical.png",
//       inactive: "/drone-inactive.png",
//       offline: "/drone-inactive.png",
//       alert: "/drone-critical.png",
//     },
//     boat: {
//       ready: "/boat-operational.png",
//       operational: "/boat-operational.png",
//       warning: "/boat-maintenance.png",
//       maintenance: "/boat-maintenance.png",
//       critical: "/boat-critical.png",
//       inactive: "/boat-inactive.png",
//       offline: "/boat-inactive.png",
//       alert: "/boat-critical.png",
//     },
//   }

//   const sizeMap = {
//     sm: "w-16 h-16",
//     md: "w-24 h-24",
//     lg: "w-32 h-32",
//   }

//   const assetMap = assetImageMap[assetType] || assetImageMap.drone
//   const assetImage = assetMap[color.toLowerCase()] || assetMap.operational

//   return (
//     <img
//       src={assetImage || "/placeholder.svg"}
//       alt={`${assetType} - ${status}`}
//       className={`${sizeMap[size]} object-contain`}
//     />
//   )
// }

"use client"

interface AssetIllustrationProps {
  color: string
  status: string
  assetType?: string
  size?: "sm" | "md" | "lg"
}

export function AssetIllustration({ color, status, assetType = "drone", size = "md" }: AssetIllustrationProps) {
  const assetImageMap: Record<string, Record<string, string>> = {
    drone: {
      ready: "/drone-operational.png",
      operational: "/drone-operational.png",
      warning: "/drone-maintenance.png",
      maintenance: "/drone-maintenance.png",
      critical: "/drone-critical.png",
      inactive: "/drone-inactive.png",
      offline: "/drone-inactive.png",
      alert: "/drone-critical.png",
    },
    boat: {
      ready: "/boat-operational.png",
      operational: "/boat-operational.png",
      warning: "/boat-maintenance.png",
      maintenance: "/boat-maintenance.png",
      critical: "/boat-critical.png",
      inactive: "/boat-inactive.png",
      offline: "/boat-inactive.png",
      alert: "/boat-critical.png",
    },
  }

  const sizeMap = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  // Get the asset type (boat or drone)
  const assetMap = assetImageMap[assetType.toLowerCase()] || assetImageMap.drone
  
  // Use status field to determine which image to load
  const normalizedStatus = status.toLowerCase()
  
  // Map status values to correct image
  let imageKey = "operational"
  
  if (normalizedStatus === "ready" || normalizedStatus === "operational") {
    imageKey = "ready"
  } else if (normalizedStatus === "maintenance" || normalizedStatus === "warning") {
    imageKey = "maintenance"
  } else if (normalizedStatus === "critical" || normalizedStatus === "alert") {
    imageKey = "critical"
  } else if (normalizedStatus === "inactive" || normalizedStatus === "offline") {
    imageKey = "inactive"
  }
  
  const assetImage = assetMap[imageKey]

  return (
    <img
      src={assetImage || "/placeholder.svg"}
      alt={`${assetType} - ${status}`}
      className={`${sizeMap[size]} object-contain`}
    />
  )
}
