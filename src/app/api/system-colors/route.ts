import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const colors = await prisma.systemColor.findMany({
      orderBy: { name: "asc" },
    })

    return NextResponse.json(colors)
  } catch (error) {
    console.error("Error fetching system colors:", error)
    return NextResponse.json(
      { error: "Error al obtener colores del sistema" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { colors } = body

    // Obtener IDs actuales
    const existingColors = await prisma.systemColor.findMany()
    const existingIds = existingColors.map((c) => c.id)
    const updatedIds = colors.filter((c: any) => c.id).map((c: any) => c.id)

    // Eliminar colores que ya no están
    const toDelete = existingIds.filter((id) => !updatedIds.includes(id))
    if (toDelete.length > 0) {
      await prisma.systemColor.deleteMany({
        where: { id: { in: toDelete } },
      })
    }

    // Actualizar o crear colores
    for (const color of colors) {
      if (color.id) {
        // Actualizar existente
        await prisma.systemColor.update({
          where: { id: color.id },
          data: {
            name: color.name,
            hexCode: color.hexCode,
            isActive: color.isActive,
          },
        })
      } else {
        // Crear nuevo
        await prisma.systemColor.create({
          data: {
            name: color.name,
            hexCode: color.hexCode,
            isActive: color.isActive,
          },
        })
      }
    }

    const updatedColors = await prisma.systemColor.findMany({
      orderBy: { name: "asc" },
    })

    return NextResponse.json(updatedColors)
  } catch (error) {
    console.error("Error updating system colors:", error)
    return NextResponse.json(
      { error: "Error al actualizar colores del sistema" },
      { status: 500 }
    )
  }
}