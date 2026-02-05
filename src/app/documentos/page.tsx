import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Plus, Eye, MessageCircle } from "lucide-react"
import { WhatsAppButton } from "@/components/WhatsAppButton"

async function getDocuments() {
  return await prisma.document.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      client: true,
      items: {
        include: {
          fabricType: true,
          fabricColor: true,
        }
      },
    },
  })
}

export default async function DocumentosPage() {
  const documents = await getDocuments()

  const getDocumentTypeBadge = (type: string) => {
    const colors: Record<string, "default" | "secondary" | "outline"> = {
      PRESUPUESTO: "outline",
      RECIBO: "default",
      REMITO: "secondary",
    }
    return colors[type] || "default"
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      DRAFT: "secondary",
      SENT: "default",
      APPROVED: "default",
      COMPLETED: "default",
      CANCELLED: "destructive",
      EXPIRED: "outline",
    }
    return colors[status] || "default"
  }

  const getProductionBadge = (status: string) => {
    const labels: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
      PENDING: { label: "Pendiente", variant: "secondary" },
      IN_PRODUCTION: { label: "En Producción", variant: "default" },
      READY: { label: "Listo", variant: "default" },
      DELIVERED: { label: "Entregado", variant: "outline" },
    }
    return labels[status] || { label: status, variant: "default" }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
          <p className="text-muted-foreground">
            Presupuestos y recibos - Envío rápido por WhatsApp
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/documentos/nuevo">
            <Plus className="mr-2 h-5 w-5" />
            Nuevo Documento
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos los Documentos</CardTitle>
          <CardDescription>
            {documents.length} documento{documents.length !== 1 ? "s" : ""}{" "}
            registrado{documents.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Nº</TableHead>
                  <TableHead className="w-[120px]">Tipo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="w-[120px]">Fecha</TableHead>
                  <TableHead className="w-[80px] text-center">Items</TableHead>
                  <TableHead className="w-[140px] text-right">Total</TableHead>
                  <TableHead className="w-[200px] text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => {
                  return (
                    <TableRow key={doc.id}>
                      <TableCell className="font-mono text-sm">
                        #{doc.number}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getDocumentTypeBadge(doc.type)}>
                          {doc.type === "PRESUPUESTO" ? "Presup." : doc.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {doc.client.name}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(doc.date)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="text-xs">
                          {doc.items.length}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(Number(doc.total))}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <WhatsAppButton
                            document={{
                              id: doc.id,
                              type: doc.type as "PRESUPUESTO" | "RECIBO",
                              number: doc.number,
                              clientName: doc.client.name,
                              clientPhone: doc.client.phone,
                              date: doc.date,
                              total: Number(doc.total),
                              items: doc.items.map(item => ({
                                productName: item.fabricType?.name || 'Producto',
                                width: item.width,
                                height: item.height,
                                quantity: item.quantity,
                                unitPrice: Number(item.unitPrice),
                                subtotal: Number(item.subtotal),
                                location: item.location || undefined
                              })),
                              observations: doc.observations || undefined,
                              validUntil: doc.validUntil || undefined,
                              estimatedDate: doc.estimatedDate || undefined
                            }}
                          />
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/documentos/${doc.id}`}>
                              <Eye className="h-3 w-3 mr-1" />
                              Ver
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {documents.length === 0 && (
            <div className="py-12 text-center">
              <div className="mb-4">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  No hay documentos registrados aún
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/documentos/nuevo">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear primer documento
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}