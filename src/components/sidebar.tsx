"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  Settings,
  Sparkles,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Documentos", href: "/documentos", icon: FileText },
  { name: "Producción", href: "/produccion", icon: Package },
  { name: "Configuración", href: "/configuracion", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-blue-900 text-white">
      {/* Logo y Header */}
      <div className="flex items-center gap-3 border-b border-blue-800 p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700">
          <Sparkles className="h-6 w-6 text-yellow-300" />
        </div>
        <div>
          <h1 className="text-lg font-bold">Azul Deco</h1>
          <p className="text-xs text-blue-300">⚡️ Cortinas en 72 hs</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-800 text-white"
                  : "text-blue-100 hover:bg-blue-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-blue-800 p-4">
        <p className="text-xs text-blue-300">
          Villa María, Córdoba
          <br />
          linktr.ee/AzulDeco
        </p>
      </div>
    </div>
  )
}
