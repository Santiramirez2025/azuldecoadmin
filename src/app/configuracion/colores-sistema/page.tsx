"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowLeft, Plus, X } from "lucide-react"
import { toast } from "sonner"

interface SystemColor {
  id?: string
  name: string
  hexCode: string
  isActive: boolean
}

export default function ColoresSistemaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [colors, setColors] = useState<SystemColor[]>([])

  useEffect(() => {
    fetch("/api/system-colors")
      .then((res) => res.json())
      .then((data) => {
        setColors(data)
        setLoading(false)
      })
      .catch(() => {
        toast.error("Error al cargar los colores")
      })
  }, [])

  const addColor = () => {
    setColors([...colors, { name: "", hexCode: "#000000", isActive: true }])
  }

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index))
  }

  const updateColor = (index: number, field: keyof SystemColor, value: any) => {
    const newColors = [...colors]
    newColors[index] = { ...newColors[index], [field]: value }
    setColors(newColors)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch("/api/system-colors", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ colors: colors.filter((c) => c.name.trim() !== "") }),
      })

      if (!response.ok) throw new Error()

      toast.success("Colores actualizados correctamente")
      router.push("/configuracion")
      router.refresh()
    } catch (error) {
      toast.error("Error al actualizar los colores")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Cargando...</div>
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
          <h1 className="text-3xl font-bold tracking-tight">
            Colores de Sistema
          </h1>
          <p className="text-muted-foreground">
            Gestiona los colores disponibles para mecanismos
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Colores Disponibles</CardTitle>
              <CardDescription>
                Agrega o edita los colores del sistema
              </CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addColor}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Color
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {colors.map((color, index) => (
              <div
                key={index}
                className="flex gap-4 items-start p-4 border rounded-lg"
              >
                <div className="flex-1 grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Nombre</Label>
                    <Input
                      value={color.name}
                      onChange={(e) => updateColor(index, "name", e.target.value)}
                      placeholder="Blanco"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Código Hexadecimal</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={color.hexCode}
                        onChange={(e) =>
                          updateColor(index, "hexCode", e.target.value)
                        }
                        className="w-20"
                      />
                      <Input
                        value={color.hexCode}
                        onChange={(e) =>
                          updateColor(index, "hexCode", e.target.value)
                        }
                        placeholder="#FFFFFF"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <div className="flex items-center gap-2 h-10">
                      <Switch
                        checked={color.isActive}
                        onCheckedChange={(checked) =>
                          updateColor(index, "isActive", checked)
                        }
                      />
                      <span className="text-sm">
                        {color.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeColor(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {colors.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No hay colores configurados. Haz clic en "Agregar Color" para comenzar.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/configuracion">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}