import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const fabricTypes = await prisma.fabricType.findMany({
      include: { colors: true },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(fabricTypes)
  } catch (error) {
    console.error("Error fetching fabric types:", error)
    return NextResponse.json(
      { error: "Error al obtener tipos de tela" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, code, pricePerSqm, resellerPrice, description, colors } = body

    // Verificar si ya existe un tipo con ese código
    const existing = await prisma.fabricType.findUnique({
      where: { code },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un tipo de tela con ese código" },
        { status: 409 }
      )
    }

    const fabricType = await prisma.fabricType.create({
      data: {
        name,
        code,
        pricePerSqm,
        resellerPrice,
        description,
        isActive: true,
        colors: {
          create: colors.map((colorName: string) => ({
            name: colorName,
            isActive: true,
          })),
        },
      },
      include: { colors: true },
    })

    return NextResponse.json(fabricType, { status: 201 })
  } catch (error) {
    console.error("Error creating fabric type:", error)
    return NextResponse.json(
      { error: "Error al crear tipo de tela" },
      { status: 500 }
    )
  }
}