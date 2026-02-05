import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "payment_surcharges" },
    })

    return NextResponse.json(
      setting || {
        key: "payment_surcharges",
        value: {
          CONTADO: 0,
          CUOTAS_3: 10,
          CUOTAS_6: 20,
          CUOTAS_12: 35,
        },
      }
    )
  } catch (error) {
    console.error("Error fetching payment surcharges:", error)
    return NextResponse.json(
      { error: "Error al obtener recargos de pago" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const setting = await prisma.setting.upsert({
      where: { key: "payment_surcharges" },
      create: {
        key: "payment_surcharges",
        value: body,
      },
      update: {
        value: body,
      },
    })

    return NextResponse.json(setting)
  } catch (error) {
    console.error("Error updating payment surcharges:", error)
    return NextResponse.json(
      { error: "Error al actualizar recargos de pago" },
      { status: 500 }
    )
  }
}