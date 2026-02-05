import { formatCurrency, formatDate } from "./utils"

interface WhatsAppItem {
  productName: string
  width: number // en cm
  height: number // en cm
  quantity: number
  unitPrice: number
  subtotal: number
  location?: string
}

interface WhatsAppDocument {
  type: "PRESUPUESTO" | "RECIBO"
  number: number
  clientName: string
  date: Date
  items: WhatsAppItem[]
  subtotal: number
  total: number
  observations?: string
  validUntil?: Date
  estimatedDate?: Date
}

export function generateWhatsAppMessage(doc: WhatsAppDocument): string {
  const emoji = doc.type === "PRESUPUESTO" ? "📋" : "🧾"
  const title = doc.type === "PRESUPUESTO" ? "PRESUPUESTO" : "RECIBO"
  
  let message = `${emoji} *${title} #${doc.number}*\n`
  message += `━━━━━━━━━━━━━━━━━━\n\n`
  
  // Cliente
  message += `👤 *Cliente:* ${doc.clientName}\n`
  message += `📅 *Fecha:* ${formatDate(doc.date)}\n`
  
  if (doc.validUntil) {
    message += `⏰ *Válido hasta:* ${formatDate(doc.validUntil)}\n`
  }
  
  if (doc.estimatedDate) {
    message += `🚚 *Entrega estimada:* ${formatDate(doc.estimatedDate)}\n`
  }
  
  message += `\n━━━━━━━━━━━━━━━━━━\n`
  message += `📦 *PRODUCTOS*\n`
  message += `━━━━━━━━━━━━━━━━━━\n\n`
  
  // Items
  doc.items.forEach((item, index) => {
    message += `*${index + 1}. ${item.productName}*\n`
    message += `   📏 Medidas: ${item.width}cm × ${item.height}cm\n`
    message += `   🔢 Cantidad: ${item.quantity}\n`
    
    if (item.location) {
      message += `   📍 Ubicación: ${item.location}\n`
    }
    
    message += `   💰 Precio: ${formatCurrency(item.unitPrice)}\n`
    
    if (item.quantity > 1) {
      message += `   💵 Subtotal: ${formatCurrency(item.subtotal)}\n`
    }
    
    message += `\n`
  })
  
  message += `━━━━━━━━━━━━━━━━━━\n`
  message += `💵 *TOTAL: ${formatCurrency(doc.total)}*\n`
  message += `━━━━━━━━━━━━━━━━━━\n`
  
  // Observaciones
  if (doc.observations) {
    message += `\n📝 *Observaciones:*\n${doc.observations}\n`
  }
  
  // Pie de página según tipo
  if (doc.type === "PRESUPUESTO") {
    message += `\n✨ *Azul Deco - Fábrica de Cortinas Roller*\n`
    message += `📍 Villa María, Córdoba\n`
    message += `\n_Para confirmar tu pedido, respondé este mensaje._`
  } else {
    message += `\n✨ *Azul Deco - Fábrica de Cortinas Roller*\n`
    message += `📍 Villa María, Córdoba\n`
    message += `\n_¡Gracias por tu compra!_`
  }
  
  return message
}

export function getWhatsAppLink(phoneNumber: string, message: string): string {
  // Limpiar el número de teléfono
  const cleanPhone = phoneNumber.replace(/\D/g, '')
  
  // Agregar código de país si no lo tiene (Argentina = 54)
  const fullPhone = cleanPhone.startsWith('54') ? cleanPhone : `54${cleanPhone}`
  
  // Codificar el mensaje para URL
  const encodedMessage = encodeURIComponent(message)
  
  // Generar link de WhatsApp
  return `https://wa.me/${fullPhone}?text=${encodedMessage}`
}

export function openWhatsApp(phoneNumber: string, message: string): void {
  const link = getWhatsAppLink(phoneNumber, message)
  window.open(link, '_blank')
}

// Función para copiar al portapapeles (backup si prefieren copiar manual)
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Error copying to clipboard:', error)
    return false
  }
}