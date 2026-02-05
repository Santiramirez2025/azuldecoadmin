"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Search } from "lucide-react"

interface EmptyDocumentsProps {
  hasFilters?: boolean
}

export function EmptyDocuments({ hasFilters = false }: EmptyDocumentsProps) {
  if (hasFilters) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No se encontraron documentos</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          No hay documentos que coincidan con los filtros aplicados. Intenta ajustar tu búsqueda o limpiar los filtros.
        </p>
        <Button variant="outline" onClick={() => window.location.href = "/documentos"}>
          Limpiar filtros
        </Button>
      </div>
    )
  }

  return (
    <div className="py-16 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No hay documentos aún</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Comienza creando tu primer presupuesto, recibo o remito para gestionar tus ventas y entregas.
      </p>
      <Button asChild>
        <Link href="/documentos/nuevo">
          <Plus className="mr-2 h-4 w-4" />
          Crear primer documento
        </Link>
      </Button>
    </div>
  )
}