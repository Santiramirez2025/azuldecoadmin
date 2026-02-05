import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Building2, 
  Palette, 
  Settings, 
  CreditCard,
  ArrowLeft,
  ChevronRight
} from "lucide-react"

export default function ConfiguracionEditarPage() {
  const sections = [
    {
      href: "/configuracion/negocio",
      icon: Building2,
      title: "Información del Negocio",
      description: "Nombre, teléfono, dirección y datos de contacto",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      href: "/configuracion/telas/nuevo",
      icon: Palette,
      title: "Tipos de Tela",
      description: "Gestionar tipos de tela, precios y colores",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      href: "/configuracion/colores-sistema",
      icon: Settings,
      title: "Colores de Sistema",
      description: "Colores disponibles para mecanismos",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      href: "/configuracion/pagos",
      icon: CreditCard,
      title: "Recargos de Pago",
      description: "Configurar recargos por método de pago",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
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
            Editar Configuración
          </h1>
          <p className="text-muted-foreground">
            Selecciona qué quieres configurar
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <Card key={section.href} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-3 ${section.bgColor}`}>
                      <Icon className={`h-6 w-6 ${section.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={section.href}>
                    Configurar
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}