import Link from "next/link"
import { prisma } from "@/lib/prisma"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { Plus, Edit, Settings, Palette, CreditCard, Building2 } from "lucide-react"

async function getConfigData() {
  const [fabricTypes, systemColors, settings] = await Promise.all([
    prisma.fabricType.findMany({
      include: {
        colors: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.systemColor.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.setting.findMany(),
  ])

  return { fabricTypes, systemColors, settings }
}

export default async function ConfiguracionPage() {
  const { fabricTypes, systemColors, settings } = await getConfigData()

  const businessInfo = settings.find((s) => s.key === "business_info")?.value as any
  const paymentSurcharges = settings.find((s) => s.key === "payment_surcharges")?.value as any

  const activeFabricTypes = fabricTypes.filter(f => f.isActive)
  const inactiveFabricTypes = fabricTypes.filter(f => !f.isActive)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">
            Gestiona precios, colores y datos del negocio
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/configuracion/editar">
            <Edit className="h-4 w-4 mr-2" />
            Editar Configuración
          </Link>
        </Button>
      </div>

      {/* Stats rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tipos de Tela
            </CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeFabricTypes.length}</div>
            <p className="text-xs text-muted-foreground">
              {fabricTypes.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Colores Sistema
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemColors.filter(c => c.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {systemColors.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Colores de Tela
            </CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fabricTypes.reduce((sum, f) => sum + f.colors.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Todos los tipos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Formas de Pago
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {paymentSurcharges ? Object.keys(paymentSurcharges).length : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Con recargos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Información del Negocio */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Información del Negocio
            </CardTitle>
            <CardDescription>Datos generales de Azul Deco</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/configuracion/negocio">
              <Edit className="h-3 w-3 mr-2" />
              Editar
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {businessInfo ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Nombre
                  </p>
                  <p className="text-lg font-semibold">{businessInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Slogan
                  </p>
                  <p className="text-base">{businessInfo.slogan}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Teléfono
                  </p>
                  <p className="text-base">{businessInfo.phone}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Email
                  </p>
                  <p className="text-base">{businessInfo.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Dirección
                  </p>
                  <p className="text-base">{businessInfo.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Website
                  </p>
                  <p className="text-base">{businessInfo.website}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No hay información del negocio configurada
              </p>
              <Button asChild>
                <Link href="/configuracion/negocio">
                  <Plus className="h-4 w-4 mr-2" />
                  Configurar Negocio
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tipos de Tela y Precios */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tipos de Tela y Precios</CardTitle>
            <CardDescription>
              {activeFabricTypes.length} tipo{activeFabricTypes.length !== 1 ? "s" : ""} activo{activeFabricTypes.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/configuracion/telas/nuevo">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Tela
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {fabricTypes.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Precio Minorista (m²)</TableHead>
                    <TableHead>Precio Revendedor (m²)</TableHead>
                    <TableHead>Colores</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeFabricTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{type.code}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(Number(type.pricePerSqm))}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(Number(type.resellerPrice))}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {type.colors.slice(0, 3).map((color) => (
                            <Badge key={color.id} variant="secondary" className="text-xs">
                              {color.name}
                            </Badge>
                          ))}
                          {type.colors.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{type.colors.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">Activo</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/configuracion/telas/${type.id}`}>
                            <Edit className="h-3 w-3" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {inactiveFabricTypes.length > 0 && (
                    <>
                      <TableRow>
                        <TableCell colSpan={7} className="bg-muted/50 text-center py-2">
                          <span className="text-sm text-muted-foreground font-medium">
                            Tipos Inactivos ({inactiveFabricTypes.length})
                          </span>
                        </TableCell>
                      </TableRow>
                      {inactiveFabricTypes.map((type) => (
                        <TableRow key={type.id} className="opacity-60">
                          <TableCell className="font-medium">{type.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{type.code}</Badge>
                          </TableCell>
                          <TableCell>
                            {formatCurrency(Number(type.pricePerSqm))}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(Number(type.resellerPrice))}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {type.colors.length} colores
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">Inactivo</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/configuracion/telas/${type.id}`}>
                                <Edit className="h-3 w-3" />
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                No hay tipos de tela configurados
              </p>
              <Button asChild>
                <Link href="/configuracion/telas/nuevo">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar primera tela
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Colores de Sistema */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Colores de Sistema (Mecanismo)</CardTitle>
            <CardDescription>
              Colores disponibles para los mecanismos de las cortinas
            </CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/configuracion/colores-sistema">
              <Edit className="h-4 w-4 mr-2" />
              Gestionar
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {systemColors.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {systemColors.filter(c => c.isActive).map((color) => (
                <div
                  key={color.id}
                  className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  {color.hexCode && (
                    <div
                      className="h-10 w-10 rounded-md border-2 shadow-sm"
                      style={{ backgroundColor: color.hexCode }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{color.name}</p>
                    {color.hexCode && (
                      <p className="text-xs text-muted-foreground font-mono">
                        {color.hexCode}
                      </p>
                    )}
                  </div>
                  <Badge variant="default" className="text-xs">Activo</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No hay colores de sistema configurados
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recargos por Forma de Pago */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recargos por Forma de Pago</CardTitle>
            <CardDescription>
              Porcentaje de recargo según el método de pago
            </CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/configuracion/pagos">
              <Edit className="h-4 w-4 mr-2" />
              Editar Recargos
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {paymentSurcharges ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(paymentSurcharges).map(([method, percentage]) => (
                <div
                  key={method}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium capitalize">
                      {method.replace(/_/g, " ")}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-base font-semibold">
                    {String(percentage)}%
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No hay recargos de pago configurados
              </p>
              <Button asChild>
                <Link href="/configuracion/pagos">
                  <Plus className="h-4 w-4 mr-2" />
                  Configurar Recargos
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}