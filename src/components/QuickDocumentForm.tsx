"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Calculator } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"

type MeasurementUnit = "cm" | "m"

interface Item {
  id: string
  productName: string
  width: string
  height: string
  widthUnit: MeasurementUnit
  heightUnit: MeasurementUnit
  unitPrice: string
  wholesalePrice: string
  priceType: "minorista" | "mayorista"
  quantity: number
  location?: string
}

// Función helper para generar IDs únicos
const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

export default function QuickDocumentForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Tipo de documento
  const [docType, setDocType] = useState<"PRESUPUESTO" | "RECIBO">("PRESUPUESTO")
  
  // Cliente
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  
  // Items
  const [items, setItems] = useState<Item[]>([{
    id: generateId(),
    productName: "",
    width: "",
    height: "",
    widthUnit: "m",
    heightUnit: "m",
    unitPrice: "",
    wholesalePrice: "",
    priceType: "minorista",
    quantity: 1,
    location: ""
  }])

  // Observaciones
  const [observations, setObservations] = useState("")

  const addItem = () => {
    setItems([...items, {
      id: generateId(),
      productName: "",
      width: "",
      height: "",
      widthUnit: "m",
      heightUnit: "m",
      unitPrice: "",
      wholesalePrice: "",
      priceType: "minorista",
      quantity: 1,
      location: ""
    }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof Item, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  // Convertir medidas a CM para cálculo
  const toCm = (value: string, unit: MeasurementUnit): number => {
    const num = parseFloat(value) || 0
    return unit === "m" ? num * 100 : num
  }

  // Calcular m² de un item
  const calculateSquareMeters = (item: Item): number => {
    const widthCm = toCm(item.width, item.widthUnit)
    const heightCm = toCm(item.height, item.heightUnit)
    return (widthCm * heightCm) / 10000
  }

  // Calcular subtotal de un item
  const calculateItemSubtotal = (item: Item): number => {
    const price = item.priceType === "mayorista" 
      ? parseFloat(item.wholesalePrice) || 0
      : parseFloat(item.unitPrice) || 0
    return price * item.quantity
  }

  // Calcular total del documento
  const calculateTotal = (): number => {
    return items.reduce((sum, item) => sum + calculateItemSubtotal(item), 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const documentData = {
        type: docType,
        client: {
          name: clientName,
          phone: clientPhone
        },
        items: items.map(item => ({
          productName: item.productName,
          width: toCm(item.width, item.widthUnit),
          height: toCm(item.height, item.heightUnit),
          unitPrice: parseFloat(item.unitPrice) || 0,
          quantity: item.quantity,
          location: item.location || null,
          squareMeters: calculateSquareMeters(item),
          subtotal: calculateItemSubtotal(item)
        })),
        observations: observations || null,
        total: calculateTotal()
      }

      console.log("📤 Enviando documento:", documentData)
      
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(documentData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || "Error al crear el documento")
      }

      console.log("✅ Documento creado:", data.document)
      
      toast.success(`${docType === "PRESUPUESTO" ? "Presupuesto" : "Recibo"} creado exitosamente`)
      
      // Redirigir a la página del documento
      router.push(`/documentos/${data.document.id}`)
      
    } catch (error) {
      console.error("❌ Error creating document:", error)
      toast.error(error instanceof Error ? error.message : "Error al crear el documento")
    } finally {
      setLoading(false)
    }
  }

  const total = calculateTotal()

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tipo de Documento */}
      <Card>
        <CardHeader>
          <CardTitle>Tipo de Documento</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={docType} onValueChange={(v: any) => setDocType(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PRESUPUESTO">Presupuesto</SelectItem>
              <SelectItem value="RECIBO">Recibo</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Cliente */}
      <Card>
        <CardHeader>
          <CardTitle>Datos del Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nombre *</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Juan Pérez"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientPhone">Teléfono (WhatsApp) *</Label>
              <Input
                id="clientPhone"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="3534123456"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Productos</CardTitle>
          <Button type="button" onClick={addItem} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {items.map((item, index) => (
            <div key={item.id} className="border rounded-lg p-4 space-y-4 relative">
              {items.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}

              <div className="font-medium text-sm text-muted-foreground">
                Item {index + 1}
              </div>

              {/* Nombre del producto */}
              <div className="space-y-2">
                <Label>Nombre del Producto *</Label>
                <Input
                  value={item.productName}
                  onChange={(e) => updateItem(item.id, "productName", e.target.value)}
                  placeholder="Ej: Cortina Roller Blackout, Cortina Sunscreen"
                  required
                />
              </div>

              {/* Medidas */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Ancho *</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={item.width}
                      onChange={(e) => updateItem(item.id, "width", e.target.value)}
                      placeholder="1.5"
                      required
                      className="flex-1"
                    />
                    <Select
                      value={item.widthUnit}
                      onValueChange={(v: MeasurementUnit) => updateItem(item.id, "widthUnit", v)}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="m">m</SelectItem>
                        <SelectItem value="cm">cm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Alto *</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      value={item.height}
                      onChange={(e) => updateItem(item.id, "height", e.target.value)}
                      placeholder="2.0"
                      required
                      className="flex-1"
                    />
                    <Select
                      value={item.heightUnit}
                      onValueChange={(v: MeasurementUnit) => updateItem(item.id, "heightUnit", v)}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="m">m</SelectItem>
                        <SelectItem value="cm">cm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Precio y cantidad */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Precio Minorista *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, "unitPrice", e.target.value)}
                    placeholder="15000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Precio Mayorista</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.wholesalePrice}
                    onChange={(e) => updateItem(item.id, "wholesalePrice", e.target.value)}
                    placeholder="12000"
                  />
                </div>
              </div>

              {/* Tipo de precio, cantidad y ubicación */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Tipo de Precio *</Label>
                  <Select
                    value={item.priceType}
                    onValueChange={(v: "minorista" | "mayorista") => updateItem(item.id, "priceType", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minorista">Minorista</SelectItem>
                      <SelectItem value="mayorista">Mayorista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Cantidad</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ubicación</Label>
                  <Input
                    value={item.location}
                    onChange={(e) => updateItem(item.id, "location", e.target.value)}
                    placeholder="Living, Dormitorio..."
                  />
                </div>
              </div>

              {/* Resumen del item */}
              {item.width && item.height && (item.unitPrice || item.wholesalePrice) && (
                <div className="bg-muted p-3 rounded text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Medidas:</span>
                    <span className="font-medium">
                      {toCm(item.width, item.widthUnit)}cm × {toCm(item.height, item.heightUnit)}cm
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Metros cuadrados:</span>
                    <span className="font-medium">
                      {calculateSquareMeters(item).toFixed(2)} m²
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Precio aplicado:</span>
                    <span className="font-medium">
                      {formatCurrency(
                        item.priceType === "mayorista" 
                          ? parseFloat(item.wholesalePrice) || 0
                          : parseFloat(item.unitPrice) || 0
                      )}
                      <span className="text-xs ml-1 text-muted-foreground">
                        ({item.priceType})
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1 mt-1">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(calculateItemSubtotal(item))}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Observaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Observaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Información adicional para el cliente..."
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Total y Acciones */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calculator className="h-5 w-5" />
              <span className="text-lg">Total:</span>
            </div>
            <div className="text-3xl font-bold">
              {formatCurrency(total)}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || total === 0}
              className="flex-1"
            >
              {loading ? "Creando..." : `Crear ${docType === "PRESUPUESTO" ? "Presupuesto" : "Recibo"} y Enviar`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}