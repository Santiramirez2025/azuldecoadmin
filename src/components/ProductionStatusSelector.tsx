"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, Clock, Package, CheckCircle, Truck } from "lucide-react"
import { toast } from "sonner"

interface ProductionStatusSelectorProps {
  documentId: string
  currentStatus: string
}

export function ProductionStatusSelector({ 
  documentId, 
  currentStatus 
}: ProductionStatusSelectorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const statuses = [
    { value: "PENDING", label: "Pendiente", icon: Clock, color: "text-orange-600" },
    { value: "IN_PRODUCTION", label: "En Producción", icon: Package, color: "text-blue-600" },
    { value: "READY", label: "Listo", icon: CheckCircle, color: "text-green-600" },
    { value: "DELIVERED", label: "Entregado", icon: Truck, color: "text-purple-600" },
  ]

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return

    setLoading(true)
    try {
      const response = await fetch(`/api/documents/${documentId}/production-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productionStatus: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar el estado")
      }

      toast.success("Estado actualizado correctamente")
      router.refresh()
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al actualizar el estado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={loading}>
          <MoreVertical className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {statuses.map((status) => {
          const Icon = status.icon
          const isCurrent = status.value === currentStatus
          
          return (
            <DropdownMenuItem
              key={status.value}
              onClick={() => handleStatusChange(status.value)}
              disabled={isCurrent}
              className={isCurrent ? "bg-muted" : ""}
            >
              <Icon className={`h-4 w-4 mr-2 ${status.color}`} />
              {status.label}
              {isCurrent && " (actual)"}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}