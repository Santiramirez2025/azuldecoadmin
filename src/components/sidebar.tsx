"use client"

import { useState } from "react"
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
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Documentos", href: "/documentos", icon: FileText },
  { name: "Producción", href: "/produccion", icon: Package },
  { name: "Configuración", href: "/configuracion", icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile Header - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-blue-900 border-b border-blue-800 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700">
              <Sparkles className="h-5 w-5 text-yellow-300" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Azul Deco</h1>
              <p className="text-xs text-blue-300">⚡️ Cortinas en 72 hs</p>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:bg-blue-800"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-blue-900 text-white transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          "flex flex-col h-full",
          "pt-16 lg:pt-0" // Padding top for mobile header
        )}
      >
        {/* Logo y Header - Desktop only */}
        <div className="hidden lg:flex items-center gap-3 border-b border-blue-800 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700">
            <Sparkles className="h-6 w-6 text-yellow-300" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Azul Deco</h1>
            <p className="text-xs text-blue-300">⚡️ Cortinas en 72 hs</p>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-800 text-white"
                    : "text-blue-100 hover:bg-blue-800 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-blue-800 p-4">
          <p className="text-xs text-blue-300 text-center lg:text-left">
            Villa María, Córdoba
            <br />
            <a 
              href="https://linktr.ee/AzulDeco" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-100 transition-colors"
            >
              linktr.ee/AzulDeco
            </a>
          </p>
        </div>
      </aside>
    </>
  )
}