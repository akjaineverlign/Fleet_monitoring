"use client"

import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import { SignalIQLogoIcon } from "./signaliq-logo"

interface MenuItem {
  label: string
  icon: React.ReactNode
  href: string
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l-7-4m7 4l7-4m0-5l2-3M9 7l6-4 6 4"
        />
      </svg>
    ),
  },
  {
    label: "Fleet Status",
    href: "/fleet-status",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    label: "Maintenance Logs",
    href: "/maintenance",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    label: "Reports",
    href: "/reports",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/settings",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

interface SidebarProps {
  currentPage?: string
}

export function Sidebar({ currentPage }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const getActiveItem = () => {
    if (pathname === "/dashboard") return "Dashboard"
    if (pathname === "/fleet-status") return "Fleet Status"
    if (pathname === "/maintenance") return "Maintenance Logs"
    if (pathname === "/reports") return "Reports"
    if (pathname === "/settings") return "Settings"
    return "Dashboard"
  }

  const activeItem = getActiveItem()

  const handleMenuClick = (href: string) => {
    router.push(href)
  }

  return (
    <div className="w-56 bg-slate-950 border-r border-slate-800 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <SignalIQLogoIcon />
        <span className="text-white font-bold text-lg">Signal-IQ</span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => handleMenuClick(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                  activeItem === item.label
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "text-gray-400 hover:bg-slate-800/50"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 text-xs text-gray-500 space-y-2">
        <p>Signal-IQ v2.1.3</p>
        <a href="#" className="block text-blue-400 hover:text-blue-300">
          Support
        </a>
      </div>
    </div>
  )
}
