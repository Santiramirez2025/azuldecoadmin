"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { 
  FileText, 
  Receipt, 
  Package, 
  TrendingUp,
  DollarSign 
} from "lucide-react"

interface DocumentStatsProps {
  stats: {
    total: number
    presupuestos: number
    recibos: number
    remitos: number
    totalValue: number | bigint
  }
}

export function DocumentStats({ stats }: DocumentStatsProps) {
  const statsConfig = [
    {
      title: "Total Documentos",
      value: stats.total,
      icon: FileText,
      description: "Todos los documentos",
      trend: null,
    },
    {
      title: "Presupuestos",
      value: stats.presupuestos,
      icon: FileText,
      description: "Cotizaciones activas",
      trend: null,
    },
    {
      title: "Recibos",
      value: stats.recibos,
      icon: Receipt,
      description: "Pagos registrados",
      trend: null,
    },
    {
      title: "Remitos",
      value: stats.remitos,
      icon: Package,
      description: "Entregas realizadas",
      trend: null,
    },
    {
      title: "Valor Total",
      value: formatCurrency(Number(stats.totalValue)),
      icon: DollarSign,
      description: "Aprobados y completados",
      trend: "+12.5%",
      isCurrency: true,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.isCurrency ? stat.value : stat.value.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
              {stat.trend && (
                <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>{stat.trend} vs mes anterior</span>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}