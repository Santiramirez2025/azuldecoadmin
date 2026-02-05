"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Filter, 
  X, 
  Calendar as CalendarIcon,
  Loader2 
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

export function DocumentFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [type, setType] = useState(searchParams.get("type") || "")
  const [status, setStatus] = useState(searchParams.get("status") || "")
  const [production, setProduction] = useState(searchParams.get("production") || "")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    searchParams.get("dateFrom") ? new Date(searchParams.get("dateFrom")!) : undefined
  )
  const [dateTo, setDateTo] = useState<Date | undefined>(
    searchParams.get("dateTo") ? new Date(searchParams.get("dateTo")!) : undefined
  )

  const updateFilters = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams)
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const clearFilters = () => {
    setSearch("")
    setType("")
    setStatus("")
    setProduction("")
    setDateFrom(undefined)
    setDateTo(undefined)
    startTransition(() => {
      router.push(pathname)
    })
  }

  const activeFiltersCount = [
    search,
    type,
    status,
    production,
    dateFrom,
    dateTo,
  ].filter(Boolean).length

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número o cliente..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              updateFilters({ search: e.target.value || undefined })
            }}
            className="pl-9"
          />
          {search && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => {
                setSearch("")
                updateFilters({ search: undefined })
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Type Filter */}
        <Select
          value={type}
          onValueChange={(value) => {
            setType(value)
            updateFilters({ type: value || undefined })
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Tipo de documento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">Todos los tipos</SelectItem>
            <SelectItem value="PRESUPUESTO">Presupuesto</SelectItem>
            <SelectItem value="RECIBO">Recibo</SelectItem>
            <SelectItem value="REMITO">Remito</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value)
            updateFilters({ status: value || undefined })
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">Todos los estados</SelectItem>
            <SelectItem value="DRAFT">Borrador</SelectItem>
            <SelectItem value="SENT">Enviado</SelectItem>
            <SelectItem value="APPROVED">Aprobado</SelectItem>
            <SelectItem value="COMPLETED">Completado</SelectItem>
            <SelectItem value="CANCELLED">Cancelado</SelectItem>
            <SelectItem value="EXPIRED">Expirado</SelectItem>
          </SelectContent>
        </Select>

        {/* Production Filter */}
        <Select
          value={production}
          onValueChange={(value) => {
            setProduction(value)
            updateFilters({ production: value || undefined })
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Producción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=" ">Todas</SelectItem>
            <SelectItem value="PENDING">Pendiente</SelectItem>
            <SelectItem value="IN_PRODUCTION">En Producción</SelectItem>
            <SelectItem value="READY">Listo</SelectItem>
            <SelectItem value="DELIVERED">Entregado</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-[240px] justify-start text-left font-normal",
                !dateFrom && !dateTo && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFrom && dateTo ? (
                <>
                  {format(dateFrom, "dd/MM/yy", { locale: es })} -{" "}
                  {format(dateTo, "dd/MM/yy", { locale: es })}
                </>
              ) : dateFrom ? (
                `Desde ${format(dateFrom, "dd/MM/yyyy", { locale: es })}`
              ) : dateTo ? (
                `Hasta ${format(dateTo, "dd/MM/yyyy", { locale: es })}`
              ) : (
                "Rango de fechas"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <div className="p-3 space-y-2">
              <div className="space-y-1">
                <label className="text-sm font-medium">Desde</label>
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={(date) => {
                    setDateFrom(date)
                    updateFilters({
                      dateFrom: date ? date.toISOString().split("T")[0] : undefined,
                    })
                  }}
                  locale={es}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Hasta</label>
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={(date) => {
                    setDateTo(date)
                    updateFilters({
                      dateTo: date ? date.toISOString().split("T")[0] : undefined,
                    })
                  }}
                  locale={es}
                />
              </div>
              {(dateFrom || dateTo) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setDateFrom(undefined)
                    setDateTo(undefined)
                    updateFilters({ dateFrom: undefined, dateTo: undefined })
                  }}
                >
                  Limpiar fechas
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="shrink-0"
          >
            <X className="mr-2 h-4 w-4" />
            Limpiar ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filtros activos:</span>
          
          {search && (
            <Badge variant="secondary" className="gap-1">
              Búsqueda: {search}
              <button
                onClick={() => {
                  setSearch("")
                  updateFilters({ search: undefined })
                }}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {type && (
            <Badge variant="secondary" className="gap-1">
              Tipo: {type}
              <button
                onClick={() => {
                  setType("")
                  updateFilters({ type: undefined })
                }}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {status && (
            <Badge variant="secondary" className="gap-1">
              Estado: {status}
              <button
                onClick={() => {
                  setStatus("")
                  updateFilters({ status: undefined })
                }}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {production && (
            <Badge variant="secondary" className="gap-1">
              Producción: {production}
              <button
                onClick={() => {
                  setProduction("")
                  updateFilters({ production: undefined })
                }}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {isPending && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Aplicando filtros...
        </div>
      )}
    </div>
  )
}