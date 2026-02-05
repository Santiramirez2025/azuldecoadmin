import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const fabricType = await prisma.fabricType.findUnique({
      where: { id },
      include: { colors: true },
    })

    if (!fabricType) {
      return NextResponse.json(
        { error: "Tipo de tela no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(fabricType)
  } catch (error) {
    console.error("Error fetching fabric type:", error)
    return NextResponse.json(
      { error: "Error al obtener tipo de tela" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const body = await request.json()
    const {
      name,
      code,
      pricePerSqm,
      resellerPrice,
      description,
      isActive,
      colors,
    } = body

    await prisma.fabricColor.deleteMany({
      where: { fabricTypeId: id },
    })

    const fabricType = await prisma.fabricType.update({
      where: { id },
      data: {
        name,
        code,
        pricePerSqm,
        resellerPrice,
        description,
        isActive,
        colors: {
          create: colors.map((color: any) => ({
            name: color.name,
            isActive: true,
          })),
        },
      },
      include: { colors: true },
    })

    return NextResponse.json(fabricType)
  } catch (error) {
    console.error("Error updating fabric type:", error)
    return NextResponse.json(
      { error: "Error al actualizar tipo de tela" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    await prisma.fabricType.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting fabric type:", error)
    return NextResponse.json(
      { error: "Error al eliminar tipo de tela" },
      { status: 500 }
    )
  }
}
