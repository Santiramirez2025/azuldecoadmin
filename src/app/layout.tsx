import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import Sidebar from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Azul Deco - Gestión de Cortinas Roller",
  description: "Sistema de gestión interno para Azul Deco - ⚡️ Tus cortinas en 72 hs",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 overflow-x-hidden bg-gray-50">
            {/* Wrapper con max-width para desktop */}
            <div className="w-full max-w-[1400px] mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 mt-16 lg:mt-0">
              {children}
            </div>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  )
}