import Link from "next/link"
import { prisma } from "@/lib/prisma"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Clock, Package, CheckCircle, Truck, Eye, Calendar } from "lucide-react"
import { ProductionStatusSelector } from "@/components/ProductionStatusSelector"

async function getProductionDocuments() {
  return await prisma.document.findMany({
    where: {
      type: {
        in: ["RECIBO", "PRESUPUESTO"]
      },
      status: {
        not: "CANCELLED"
      }
    },
    orderBy: [
      { productionStatus: "asc" },
      { estimatedDate: "asc" }
    ],
    include: {
      client: true,
      items: true,
    },
  })
}

export default async function ProduccionPage() {
  const documents = await getProductionDocuments()

  const columns = [
    {
      status: "PENDING",
      title: "Pendiente",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      borderColor: "border-orange-200",
    },
    {
      status: "IN_PRODUCTION",
      title: "En Producción",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-200",
    },
    {
      status: "READY",
      title: "Listo",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-200",
    },
    {
      status: "DELIVERED",
      title: "Entregado",
      icon: Truck,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      borderColor: "border-purple-200",
    },
  ]

  // Calcular totales por estado
  const stats = columns.map(col => {
    const docs = documents.filter(d => d.productionStatus === col.status)
    const total = docs.reduce((sum, doc) => sum + Number(doc.total), 0)
    return {
      ...col,
      count: docs.length,
      total
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Producción</h1>
        <p className="text-muted-foreground">
          Gestiona el estado de fabricación de las cortinas
        </p>
      </div>

      {/* Resumen rápido */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.status}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.count}</div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(stat.total)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {columns.map((column) => {
          const columnDocs = documents.filter(
            (doc) => doc.productionStatus === column.status
          )

          return (
            <Card key={column.status} className={`border-t-4 ${column.borderColor}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`rounded-full p-2 ${column.bgColor}`}>
                      <column.icon className={`h-4 w-4 ${column.color}`} />
                    </div>
                    <CardTitle className="text-sm font-medium">
                      {column.title}
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className="font-semibold">
                    {columnDocs.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                {columnDocs.map((doc) => {
                  const isUrgent = doc.estimatedDate && 
                    new Date(doc.estimatedDate) < new Date(Date.now() + 24 * 60 * 60 * 1000)
                  
                  return (
                    <div
                      key={doc.id}
                      className="rounded-lg border bg-white p-3 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <Badge 
                          variant={doc.type === "RECIBO" ? "default" : "outline"} 
                          className="text-xs"
                        >
                          {doc.type} #{doc.number}
                        </Badge>
                        {isUrgent && column.status !== "DELIVERED" && (
                          <Badge variant="destructive" className="text-xs">
                            Urgente
                          </Badge>
                        )}
                      </div>
                      
                      <p className="mb-2 font-medium text-sm">{doc.client.name}</p>
                      
                      <div className="mb-2 text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          <span>{doc.items.length} item{doc.items.length !== 1 ? "s" : ""}</span>
                        </div>
                        {doc.estimatedDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(doc.estimatedDate)}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm font-semibold">
                          {formatCurrency(Number(doc.total))}
                        </span>
                        <div className="flex gap-1">
                          <ProductionStatusSelector 
                            documentId={doc.id}
                            currentStatus={doc.productionStatus}
                          />
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/documentos/${doc.id}`}>
                              <Eye className="h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {columnDocs.length === 0 && (
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      No hay documentos
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}