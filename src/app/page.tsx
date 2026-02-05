import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  FileText,
  Package,
  TrendingUp,
  Users,
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen general de Azul Deco - Fábrica de Cortinas Roller
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Documentos Recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadge(doc.status)}>
                      {getDocumentTypeBadge(doc.type)} #{doc.number}
                    </Badge>
                    <span className="text-sm font-medium">
                      {doc.client.name}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(doc.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(Number(doc.total))}
                  </p>
                  <Badge variant="outline" className="mt-1">
                    {doc.status}
                  </Badge>
                </div>
              </div>
            ))}
            {data.recentDocuments.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                No hay documentos recientes
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
