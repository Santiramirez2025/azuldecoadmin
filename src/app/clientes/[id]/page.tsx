import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowLeft, Mail, Phone, MapPin, FileText, Edit } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

async function getClient(id: string) {
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      documents: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  })

  if (!client) return null
  return client
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const client = await getClient(id)

  if (!client) {
    notFound()
  }

  const getDocumentTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      PRESUPUESTO: "Presupuesto",
      RECIBO: "Recibo",
      REMITO: "Remito",
    }
    return labels[type] || type
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/clientes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
            <p className="text-muted-foreground">
              Cliente desde {formatDate(client.createdAt)}
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/clientes/${client.id}/editar`}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Link>
        </Button>
      </div>

      {/* Info del Cliente */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{client.phone}</span>
            </div>
            {client.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{client.email}</span>
              </div>
            )}
            {client.dni && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">DNI:</span>
                <span>{client.dni}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>
                {client.city}, {client.province}
              </span>
            </div>
            {client.address && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Dirección:</span>
                <span>{client.address}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Tipo:</span>
              <Badge variant={client.type === "REVENDEDOR" ? "default" : "secondary"}>
                {client.type}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notas */}
      {client.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{client.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Documentos Recientes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Documentos Recientes</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {client.documents.length} documento{client.documents.length !== 1 ? "s" : ""} total
              {client.documents.length !== 1 ? "es" : ""}
            </p>
          </div>
          <Button asChild>
            <Link href="/documentos/nuevo">
              <FileText className="h-4 w-4 mr-2" />
              Nuevo Documento
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {client.documents.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Documento</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {client.documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="font-medium">
                          {getDocumentTypeBadge(doc.type)} #{doc.number}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(doc.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(doc.status)}>
                          {doc.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(Number(doc.total))}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/documentos/${doc.id}`}>Ver</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                No hay documentos para este cliente aún
              </p>
              <Button asChild>
                <Link href="/documentos/nuevo">
                  <FileText className="h-4 w-4 mr-2" />
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