"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowLeft, Plus, X } from "lucide-react"
import { toast } from "sonner"

export default function NuevaTela() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    pricePerSqm: "",
    resellerPrice: "",
    description: "",
  })
  const [colors, setColors] = useState<string[]>([""])

  const addColor = () => setColors([...colors, ""])
  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index))
  }
  const updateColor = (index: number, value: string) => {
    const newColors = [...colors]
    newColors[index] = value
    setColors(newColors)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/fabric-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          pricePerSqm: parseFloat(formData.pricePerSqm),
          resellerPrice: parseFloat(formData.resellerPrice),
          colors: colors.filter((c) => c.trim() !== ""),
        }),
      })

      if (!response.ok) throw new Error()

      toast.success("Tipo de tela creado correctamente")
      router.push("/configuracion")
      router.refresh()
    } catch (error) {
      toast.error("Error al crear el tipo de tela")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/configuracion">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Tipo de Tela</h1>
          <p className="text-muted-foreground">
            Agrega un nuevo tipo de tela con sus precios y colores
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Blackout"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="BLK-001"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerSqm">Precio Minorista (por m²) *</Label>
                <Input
                  id="pricePerSqm"
                  type="number"
                  step="0.01"
                  value={formData.pricePerSqm}
                  onChange={(e) =>
                    setFormData({ ...formData, pricePerSqm: e.target.value })
                  }
                  placeholder="15000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resellerPrice">Precio Revendedor (por m²) *</Label>
                <Input
                  id="resellerPrice"
                  type="number"
                  step="0.01"
                  value={formData.resellerPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, resellerPrice: e.target.value })
                  }
                  placeholder="12000"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descripción del tipo de tela..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Colores Disponibles</CardTitle>
              <CardDescription>Agrega los colores disponibles para esta tela</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addColor}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Color
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {colors.map((color, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={color}
                  onChange={(e) => updateColor(index, e.target.value)}
                  placeholder="Nombre del color"
                />
                {colors.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeColor(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear Tipo de Tela"}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/configuracion">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}