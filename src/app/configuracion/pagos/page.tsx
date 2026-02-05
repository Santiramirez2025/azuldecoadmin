"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowLeft, CreditCard } from "lucide-react"
import { toast } from "sonner"

export default function RecargosPagoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [surcharges, setSurcharges] = useState({
    CONTADO: 0,
    CUOTAS_3: 10,
    CUOTAS_6: 20,
    CUOTAS_12: 35,
  })

  useEffect(() => {
    fetch("/api/settings/payment-surcharges")
      .then((res) => res.json())
      .then((data) => {
        if (data.value) {
          setSurcharges(data.value)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch("/api/settings/payment-surcharges", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(surcharges),
      })

      if (!response.ok) throw new Error()

      toast.success("Recargos actualizados correctamente")
      router.push("/configuracion")
      router.refresh()
    } catch (error) {
      toast.error("Error al actualizar los recargos")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Cargando...</div>
  }

  const paymentMethods = [
    { key: "CONTADO", label: "Contado" },
    { key: "CUOTAS_3", label: "3 Cuotas" },
    { key: "CUOTAS_6", label: "6 Cuotas" },
    { key: "CUOTAS_12", label: "12 Cuotas" },
  ]

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
            Recargos por Forma de Pago
          </h1>
          <p className="text-muted-foreground">
            Configura los porcentajes de recargo según el método de pago
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Métodos de Pago
          </CardTitle>
          <CardDescription>
            Ingresa el porcentaje de recargo para cada forma de pago
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {paymentMethods.map((method) => (
                <div
                  key={method.key}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <Label htmlFor={method.key} className="text-base font-medium">
                    {method.label}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id={method.key}
                      type="number"
                      step="0.1"
                      value={surcharges[method.key as keyof typeof surcharges]}
                      onChange={(e) =>
                        setSurcharges({
                          ...surcharges,
                          [method.key]: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-24 text-right"
                    />
                    <span className="text-lg font-semibold">%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/configuracion">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vista Previa</CardTitle>
          <CardDescription>
            Ejemplo de cómo se aplicarán los recargos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="font-medium">Precio base: $100,000</p>
            {paymentMethods.map((method) => {
              const surcharge = surcharges[method.key as keyof typeof surcharges]
              const total = 100000 * (1 + surcharge / 100)
              return (
                <div
                  key={method.key}
                  className="flex justify-between py-2 border-b"
                >
                  <span>{method.label}</span>
                  <span className="font-semibold">
                    ${total.toLocaleString("es-AR", { maximumFractionDigits: 0 })}{" "}
                    <span className="text-muted-foreground text-xs">
                      (+{surcharge}%)
                    </span>
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}