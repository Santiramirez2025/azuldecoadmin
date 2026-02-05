"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { WhatsAppButton } from "@/components/WhatsAppButton"
import { Separator } from "@/components/ui/separator"
import { FileText, User, Phone, Calendar, Package } from "lucide-react"

export default function DocumentDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const openWhatsApp = searchParams.get("openWhatsApp") === "true"
  const [document, setDocument] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDocument() {
      try {
        const response = await fetch(`/api/documents/${params.id}`)
        const data = await response.json()
        setDocument(data.document)
      } catch (error) {
        console.error("Error fetching document:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchDocument()
    }
  }, [params.id])

  // Auto-abrir WhatsApp si viene del formulario
  useEffect(() => {
    if (document && openWhatsApp) {
      // Pequeño delay para que cargue la página
      setTimeout(() => {
        const button = document.querySelector('[data-whatsapp-button]')
        if (button) {
          (button as HTMLElement).click()
        }
      }, 500)
    }
  }, [document, openWhatsApp])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Cargando documento...</p>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Documento no encontrado</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">
              {document.type === "PRESUPUESTO" ? "Presupuesto" : "Recibo"} #{document.number}
            </h1>
            <Badge variant={document.type === "PRESUPUESTO" ? "outline" : "default"}>
              {document.type}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Creado el {formatDate(document.date)}
          </p>
        </div>
        
        <div data-whatsapp-button>
          <WhatsAppButton
            document={{
              id: document.id,
              type: document.type,
              number: document.number,
              clientName: document.client.name,
              clientPhone: document.client.phone,
              date: new Date(document.date),
              total: Number(document.total),
              items: document.items.map((item: any) => ({
                productName: item.productName,
                width: item.width,
                height: item.height,
                quantity: item.quantity,
                unitPrice: Number(item.unitPrice),
                subtotal: Number(item.subtotal),
                location: item.location
              })),
              observations: document.observations,
              validUntil: document.validUntil ? new Date(document.validUntil) : undefined,
              estimatedDate: document.estimatedDate ? new Date(document.estimatedDate) : undefined
            }}
            variant="default"
            size="lg"
          />
        </div>
      </div>

      {/* Información del Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Información del Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nombre:</span>
            <span className="font-medium">{document.client.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Teléfono:
            </span>
            <span className="font-medium">{document.client.phone}</span>
          </div>
          {document.validUntil && (
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Válido hasta:
              </span>
              <span className="font-medium">{formatDate(document.validUntil)}</span>
            </div>
          )}
          {document.estimatedDate && (
            <div className="flex justify-between">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Entrega estimada:
              </span>
              <span className="font-medium">{formatDate(document.estimatedDate)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Productos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {document.items.map((item: any, index: number) => (
            <div key={item.id}>
              {index > 0 && <Separator className="my-4" />}
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{item.productName}</h3>
                    {item.location && (
                      <p className="text-sm text-muted-foreground">
                        📍 {item.location}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary">x{item.quantity}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Medidas:</span>
                    <span className="ml-2 font-medium">{item.width}cm × {item.height}cm</span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground">Precio unitario:</span>
                    <span className="ml-2 font-medium">{formatCurrency(Number(item.unitPrice))}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-muted-foreground">
                    {Number(item.squareMeters).toFixed(2)} m²
                  </span>
                  <span className="font-semibold text-lg">
                    {formatCurrency(Number(item.subtotal))}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Observaciones */}
      {document.observations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Observaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{document.observations}</p>
          </CardContent>
        </Card>
      )}

      {/* Total */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-semibold">TOTAL</span>
            <span className="text-4xl font-bold text-primary">
              {formatCurrency(Number(document.total))}
            </span>
          </div>
        </CardContent>
      </Card>

      {openWhatsApp && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-800">
            ✅ Documento creado exitosamente. Click en el botón de WhatsApp para enviarlo.
          </p>
        </div>
      )}
    </div>
  )
}