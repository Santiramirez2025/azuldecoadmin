import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "business_info" },
    })

    return NextResponse.json(setting || { key: "business_info", value: null })
  } catch (error) {
    console.error("Error fetching business info:", error)
    return NextResponse.json(
      { error: "Error al obtener información del negocio" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const setting = await prisma.setting.upsert({
      where: { key: "business_info" },
      create: {
        key: "business_info",
        value: body,
      },
      update: {
        value: body,
      },
    })

    return NextResponse.json(setting)
  } catch (error) {
    console.error("Error updating business info:", error)
    return NextResponse.json(
      { error: "Error al actualizar información del negocio" },
      { status: 500 }
    )
  }
}