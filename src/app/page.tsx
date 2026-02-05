import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  FileText,
  Package,
  TrendingUp,
  Users,
  Plus,
} from "lucide-react"

async function getDashboardData() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalClients,
    monthDocuments,
    pendingProduction,
    monthRevenue,
    recentDocuments,
  ] = await Promise.all([
    prisma.client.count(),
    prisma.document.count({
      where: {
        createdAt: { gte: startOfMonth },
      },
    }),
    prisma.document.count({
      where: {
        productionStatus: { in: ["PENDING", "IN_PRODUCTION"] },
      },
    }),
    prisma.document.aggregate({
      where: {
        createdAt: { gte: startOfMonth },
        type: { in: ["RECIBO", "PRESUPUESTO"] },
      },
      _sum: { total: true },
    }),
    prisma.document.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        client: true,
      },
    }),
  ])

  return {
    totalClients,
    monthDocuments,
    pendingProduction,
    monthRevenue: monthRevenue._sum.total || 0,
    recentDocuments,
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  const stats = [
    {
      title: "Clientes Totales",
      value: data.totalClients,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Documentos Este Mes",
      value: data.monthDocuments,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "En Producción",
      value: data.pendingProduction,
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Facturación del Mes",
      value: formatCurrency(Number(data.monthRevenue)),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      DRAFT: "secondary",
      SENT: "default",
      APPROVED: "default",
      COMPLETED: "default",
      CANCELLED: "destructive",
      EXPIRED: "outline",
    }
    return variants[status] || "default"
  }

  const getDocumentTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      PRESUPUESTO: "Presupuesto",
      RECIBO: "Recibo",
      REMITO: "Remito",
    }
    return labels[type] || type
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Resumen general de Azul Deco - Fábrica de Cortinas Roller
          </p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/documentos/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Documento
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full p-2.5 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Documentos Recientes */}
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">Documentos Recientes</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Últimos {data.recentDocuments.length} documentos creados
            </p>
          </div>
          <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
            <Link href="/documentos">Ver todos</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {data.recentDocuments.length > 0 ? (
            <div className="space-y-4">
              {data.recentDocuments.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/documentos/${doc.id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={getStatusBadge(doc.status)} className="text-xs">
                        {getDocumentTypeBadge(doc.type)} #{doc.number}
                      </Badge>
                      <span className="text-sm font-medium truncate">
                        {doc.client.name}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(doc.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                    <p className="text-lg sm:text-xl font-bold">
                      {formatCurrency(Number(doc.total))}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {doc.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                No hay documentos recientes
              </p>
              <Button asChild>
                <Link href="/documentos/nuevo">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear primer documento
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/clientes/nuevo" className="block">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5 text-blue-600" />
                Nuevo Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Registra un nuevo cliente en el sistema
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/documentos/nuevo" className="block">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5 text-purple-600" />
                Nuevo Presupuesto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Crea un presupuesto o recibo rápidamente
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/produccion" className="block">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-5 w-5 text-orange-600" />
                Ver Producción
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gestiona los pedidos en producción
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
}