import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const document = await prisma.document.findUnique({
      where: {
        id: id
      },
      include: {
        client: true,
        items: true,
        createdBy: true
      }
    })

    if (!document) {
      return NextResponse.json(
        { error: "Documento no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      document
    })

  } catch (error) {
    console.error("Error fetching document:", error)
    return NextResponse.json(
      { error: "Error al obtener el documento" },
      { status: 500 }
    )
  }
}