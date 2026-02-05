"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowLeft, Plus, X, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Color {
  id?: string
  name: string
}

export default function EditarTelaClient({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    pricePerSqm: "",
    resellerPrice: "",
    description: "",
    isActive: true,
  })
  const [colors, setColors] = useState<Color[]>([])

  useEffect(() => {
    fetch(`/api/fabric-types/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          name: data.name,
          code: data.code,
          pricePerSqm: data.pricePerSqm.toString(),
          resellerPrice: data.resellerPrice.toString(),
          description: data.description || "",
          isActive: data.isActive,
        })
        setColors(data.colors.map((c: any) => ({ id: c.id, name: c.name })))
        setLoading(false)
      })
      .catch(() => {
        toast.error("Error al cargar los datos")
        router.push("/configuracion")
      })
  }, [id, router])

  const addColor = () => setColors([...colors, { name: "" }])
  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index))
  }
  const updateColor = (index: number, value: string) => {
    const newColors = [...colors]
    newColors[index].name = value
    setColors(newColors)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/fabric-types/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          pricePerSqm: parseFloat(formData.pricePerSqm),
          resellerPrice: parseFloat(formData.resellerPrice),
          colors: colors.filter((c) => c.name.trim() !== ""),
        }),
      })

      if (!response.ok) throw new Error()

      toast.success("Tipo de tela actualizado correctamente")
      router.push("/configuracion")
      router.refresh()
    } catch (error) {
      toast.error("Error al actualizar el tipo de tela")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/fabric-types/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error()

      toast.success("Tipo de tela eliminado correctamente")
      router.push("/configuracion")
      router.refresh()
    } catch (error) {
      toast.error("Error al eliminar el tipo de tela")
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/configuracion">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Editar Tipo de Tela
            </h1>
            <p className="text-muted-foreground">Modifica la información de la tela</p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente este
                tipo de tela y todos sus colores asociados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Estado</Label>
                <p className="text-sm text-muted-foreground">
                  {formData.isActive ? "Activo" : "Inactivo"}
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
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
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Colores Disponibles</CardTitle>
              <CardDescription>Gestiona los colores de esta tela</CardDescription>
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
                  value={color.name}
                  onChange={(e) => updateColor(index, e.target.value)}
                  placeholder="Nombre del color"
                />
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