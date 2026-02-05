import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, client, items, observations, total } = body

    // Validaciones básicas
    if (!type || !client?.name || !client?.phone || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Datos incompletos", details: "Faltan campos requeridos" },
        { status: 400 }
      )
    }

    // 1. Buscar o crear cliente
    let clientRecord = await prisma.client.findFirst({
      where: { phone: client.phone }
    })

    if (!clientRecord) {
      clientRecord = await prisma.client.create({
        data: {
          name: client.name,
          phone: client.phone,
          type: "MINORISTA"
        }
      })
    }

    // 2. Obtener o crear usuario por defecto
    let user = await prisma.user.findFirst()
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "admin@azuldeco.com",
          name: "Administrador",
          role: "ADMIN"
        }
      })
    }

    // 3. Obtener siguiente número de documento
    const lastDocument = await prisma.document.findFirst({
      where: { type },
      orderBy: { number: 'desc' }
    })
    
    const nextNumber = (lastDocument?.number || 0) + 1

    // 4. Calcular fechas
    const validUntil = type === "PRESUPUESTO" 
      ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      : null
    
    const estimatedDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)

    // 5. Crear documento con items
    const document = await prisma.document.create({
      data: {
        type,
        number: nextNumber,
        clientId: clientRecord.id,
        userId: user.id,
        status: "DRAFT",
        date: new Date(),
        validUntil,
        estimatedDate,
        subtotal: total,
        total,
        observations: observations || null,
        items: {
          create: items.map((item: any) => ({
            productName: item.productName,
            width: Math.round(item.width),
            height: Math.round(item.height),
            pricePerSqm: item.squareMeters > 0 ? item.unitPrice / item.squareMeters : 0,
            squareMeters: item.squareMeters,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
            location: item.location || null,
            status: "PENDING",
          }))
        }
      },
      include: {
        client: true,
        items: true,
        createdBy: true
      }
    })

    return NextResponse.json({
      success: true,
      document
    })

  } catch (error) {
    console.error("Error al crear documento:", error)
    
    return NextResponse.json(
      { 
        error: "Error al crear el documento",
        details: error instanceof Error ? error.message : "Error desconocido"
      },
      { status: 500 }
    )
  }
}