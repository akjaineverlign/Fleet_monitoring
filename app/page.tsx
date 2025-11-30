// "use client"

// import { useState, useEffect } from "react"
// import { Sidebar } from "@/components/sidebar"
// import { StatBox } from "@/components/stat-box"
// import { AssetCard } from "@/components/asset-card"

// interface Asset {
//   id: string
//   name: string
//   status: string
//   color: string
// }

// const ITEMS_PER_PAGE = 15

// export default function Home() {
//   const [assets, setAssets] = useState<Asset[]>([])
//   const [assetType, setAssetType] = useState("drone")
//   const [currentPage, setCurrentPage] = useState(1)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetch("/assets-data.json")
//       .then((res) => res.json())
//       .then((data) => {
//         setAssets(data.assets)
//         setAssetType(data.assetType)
//         setLoading(false)
//       })
//       .catch(() => setLoading(false))
//   }, [])

//   const totalPages = Math.ceil(assets.length / ITEMS_PER_PAGE)
//   const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
//   const paginatedAssets = assets.slice(startIdx, startIdx + ITEMS_PER_PAGE)

//   const stats = {
//     total: assets.length,
//     operational: assets.filter((a) => a.status === "READY").length,
//     maintenance: assets.filter((a) => a.status === "MAINTENANCE").length,
//     critical: assets.filter((a) => ["CRITICAL", "ALERT"].includes(a.status)).length,
//     inactive: assets.filter((a) => ["INACTIVE", "OFFLINE"].includes(a.status)).length,
//   }

//   const getPercentage = (value: number) => {
//     const percentage = Math.round((value / stats.total) * 100)
//     return `${percentage}%`
//   }

//   if (loading) {
//     return <div className="flex items-center justify-center h-screen">Loading...</div>
//   }

//   const pageTitle = `Fleet Operations Command Center`

//   return (
//     <div className="flex h-screen bg-slate-950">
//       <Sidebar />

//       <main className="flex-1 overflow-auto bg-slate-950">
//         {/* Header Section */}
//         <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900/50 to-transparent p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-4xl font-bold text-white mb-2">{pageTitle}</h1>
//               <p className="text-sm text-gray-400">
//                 Last Updated<span className="text-cyan-400 ml-2 font-mono">12:45:32 UTC</span>
//               </p>
//             </div>
//             {/* Header Icons */}
//             <div className="flex items-center gap-3">
//               <button className="p-2.5 hover:bg-slate-800 rounded-lg transition-colors">
//                 <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                   />
//                 </svg>
//               </button>
//               <button className="relative p-2.5 hover:bg-slate-800 rounded-lg transition-colors">
//                 <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//                   />
//                 </svg>
//                 <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Stats Section - Updated with new KPI names */}
//         <div className="grid grid-cols-5 gap-4 p-6 border-b border-slate-800 bg-slate-900/10">
//           <StatBox
//             label="Operational Readiness Rate"
//             value={String(stats.operational)}
//             assetStatus="ready"
//             assetType={assetType}
//           />
//           <StatBox
//             label="Operational Assets"
//             value={String(stats.operational)}
//             percentage={getPercentage(stats.operational)}
//             assetStatus="ready"
//             assetType={assetType}
//           />
//           <StatBox
//             label="At Risk Assets"
//             value={String(stats.maintenance)}
//             percentage={getPercentage(stats.maintenance)}
//             assetStatus="critical"
//             assetType={assetType}
//           />
//           <StatBox
//             label="Field Level Maintenance"
//             value={String(assets.filter((a) => a.status === "AT-RISK").length)}
//             percentage={getPercentage(assets.filter((a) => a.status === "AT-RISK").length)}
//             assetStatus="maintenance"
//             assetType={assetType}
//           />
//           <StatBox
//             label="Depot Level Maintenance"
//             value={String(stats.inactive)}
//             percentage={getPercentage(stats.inactive)}
//             assetStatus="inactive"
//             assetType={assetType}
//           />
//         </div>

//         {/* Fleet Status Section */}
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-bold text-white">
//               Fleet Readiness Overview
//             </h2>
//             <div className="flex items-center gap-3">
//               <input
//                 type="text"
//                 placeholder="Search units..."
//                 className="px-4 py-2 bg-slate-800/30 border border-slate-700 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
//               />
//               <button className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors">
//                 Filter
//               </button>
//             </div>
//           </div>

//           {/* Asset Cards Grid */}
//           <div className="grid grid-cols-5 gap-4 mb-8">
//             {paginatedAssets.map((asset) => (
//               <AssetCard
//                 key={asset.id}
//                 id={asset.id}
//                 name={asset.name}
//                 status={asset.status}
//                 color={asset.color}
//                 assetType={assetType}
//               />
//             ))}
//           </div>

//           {/* Pagination */}
//           <div className="flex items-center justify-center gap-2 mt-10">
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
//               disabled={currentPage === 1}
//               className="px-4 py-2 hover:bg-slate-800/50 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors text-sm"
//             >
//               ← Prev
//             </button>

//             {Array.from({ length: Math.min(6, totalPages) }, (_, i) => {
//               const pageNum = currentPage <= 3 ? i + 1 : currentPage + i - 2
//               if (pageNum > totalPages || pageNum < 1) return null
//               return (
//                 <button
//                   key={pageNum}
//                   onClick={() => setCurrentPage(pageNum)}
//                   className={`w-9 h-9 rounded transition-colors text-sm font-medium ${
//                     pageNum === currentPage ? "bg-blue-500 text-white" : "hover:bg-slate-800/50 text-gray-400"
//                   }`}
//                 >
//                   {String(pageNum).padStart(2, "0")}
//                 </button>
//               )
//             })}

//             <button
//               onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
//               disabled={currentPage === totalPages}
//               className="px-4 py-2 hover:bg-slate-800/50 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors text-sm"
//             >
//               Next →
//             </button>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="border-t border-slate-800 bg-slate-900/30 p-4 flex items-center justify-between text-xs text-gray-500 mt-8">
//           <div className="flex gap-8">
//             <span>SignalIQ v2.1.3</span>
//             <a href="#" className="text-blue-400 hover:text-blue-300">
//               Support
//             </a>
//           </div>
//           <span>© 2025 Fleet Operations Center</span>
//         </div>
//       </main>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { StatBox } from "@/components/stat-box"
import { AssetCard } from "@/components/asset-card"

interface Asset {
  id: string
  name: string
  status: string
  color: string
}

const ITEMS_PER_PAGE = 15

export default function Home() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [assetType, setAssetType] = useState("boat")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/assets-data.json")
      .then((res) => res.json())
      .then((data) => {
        setAssets(data.assets)
        setAssetType(data.assetType)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const totalPages = Math.ceil(assets.length / ITEMS_PER_PAGE)
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedAssets = assets.slice(startIdx, startIdx + ITEMS_PER_PAGE)

  const stats = {
    total: assets.length,
    operational: assets.filter((a) => a.status === "READY").length,
    maintenance: assets.filter((a) => a.status === "MAINTENANCE").length,
    critical: assets.filter((a) => a.status === "CRITICAL").length,
    inactive: assets.filter((a) => ["INACTIVE", "OFFLINE"].includes(a.status)).length,
  }

  const getPercentage = (value: number) => {
    const percentage = Math.round((value / stats.total) * 100)
    return `${percentage}%`
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 overflow-auto bg-slate-950">
        {/* Header Section */}
        <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900/50 to-transparent p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Fleet Operations Command Center</h1>
              <p className="text-sm text-gray-400">
                Total Assets: <span className="text-cyan-400 ml-2 font-mono font-bold">{stats.total}</span>
              </p>
            </div>
            {/* Header Icons */}
            <div className="flex items-center gap-3">
              <button className="p-2.5 hover:bg-slate-800 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <button className="relative p-2.5 hover:bg-slate-800 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-5 gap-4 p-6 border-b border-slate-800 bg-slate-900/10">
          <StatBox
            label="Total Assets"
            value={String(stats.total)}
            assetStatus="ready"
            assetType={assetType}
          />
          <StatBox
            label="Operational"
            value={String(stats.operational)}
            percentage={getPercentage(stats.operational)}
            assetStatus="ready"
            assetType={assetType}
          />
          <StatBox
            label="Maintenance"
            value={String(stats.maintenance)}
            percentage={getPercentage(stats.maintenance)}
            assetStatus="maintenance"
            assetType={assetType}
          />
          <StatBox
            label="Critical"
            value={String(stats.critical)}
            percentage={getPercentage(stats.critical)}
            assetStatus="critical"
            assetType={assetType}
          />
          <StatBox
            label="Inactive"
            value={String(stats.inactive)}
            percentage={getPercentage(stats.inactive)}
            assetStatus="inactive"
            assetType={assetType}
          />
        </div>

        {/* Fleet Status Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Fleet Readiness Overview
            </h2>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search units..."
                className="px-4 py-2 bg-slate-800/30 border border-slate-700 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50"
              />
              <button className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors">
                Filter
              </button>
            </div>
          </div>

          {/* Asset Cards Grid */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            {paginatedAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                id={asset.id}
                name={asset.name}
                status={asset.status}
                color={asset.color}
                assetType={assetType}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 hover:bg-slate-800/50 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors text-sm"
            >
              ← Prev
            </button>

            {Array.from({ length: Math.min(6, totalPages) }, (_, i) => {
              const pageNum = currentPage <= 3 ? i + 1 : currentPage + i - 2
              if (pageNum > totalPages || pageNum < 1) return null
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded transition-colors text-sm font-medium ${
                    pageNum === currentPage ? "bg-blue-500 text-white" : "hover:bg-slate-800/50 text-gray-400"
                  }`}
                >
                  {String(pageNum).padStart(2, "0")}
                </button>
              )
            })}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 hover:bg-slate-800/50 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors text-sm"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 bg-slate-900/30 p-4 flex items-center justify-between text-xs text-gray-500 mt-8">
          <div className="flex gap-8">
            <span>SignalIQ v2.1.3</span>
            <a href="#" className="text-blue-400 hover:text-blue-300">
              Support
            </a>
          </div>
          <span>© 2025 Fleet Operations Center</span>
        </div>
      </main>
    </div>
  )
}