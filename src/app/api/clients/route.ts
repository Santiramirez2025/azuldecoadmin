import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/clients - Obtener todos los clientes
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { documents: true },
        },
      },
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json(
      { error: "Error al obtener clientes" },
      { status: 500 }
    )
  }
}

// POST /api/clients - Crear nuevo cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validaciones
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { error: "Nombre y teléfono son obligatorios" },
        { status: 400 }
      )
    }

    // Verificar si ya existe un cliente con ese teléfono
    const existingClient = await prisma.client.findFirst({
      where: { phone: body.phone }
    })

    if (existingClient) {
      return NextResponse.json(
        { error: "Ya existe un cliente con ese número de teléfono" },
        { status: 409 }
      )
    }

    const client = await prisma.client.create({
      data: {
        name: body.name,
        type: body.type || "MINORISTA",
        dni: body.dni || null,
        phone: body.phone,
        email: body.email || null,
        address: body.address || null,
        city: body.city || "Villa María",
        province: body.province || "Córdoba",
        notes: body.notes || null,
      },
    })

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error("Error creating client:", error)
    return NextResponse.json(
      { error: "Error al crear cliente", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    )
  }
}