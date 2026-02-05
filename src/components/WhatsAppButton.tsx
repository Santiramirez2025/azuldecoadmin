"use client"

import { MessageCircle, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateWhatsAppMessage, openWhatsApp, copyToClipboard } from "@/lib/whatsapp"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface WhatsAppButtonProps {
  document: {
    id: string
    type: "PRESUPUESTO" | "RECIBO"
    number: number
    clientName: string
    clientPhone: string
    date: Date
    total: number
    items: Array<{
      productName: string
      width: number
      height: number
      quantity: number
      unitPrice: number
      subtotal: number
      location?: string
    }>
    observations?: string
    validUntil?: Date
    estimatedDate?: Date
  }
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export function WhatsAppButton({ document, variant = "default", size = "sm" }: WhatsAppButtonProps) {
  const [copied, setCopied] = useState(false)

  const message = generateWhatsAppMessage({
    type: document.type,
    number: document.number,
    clientName: document.clientName,
    date: document.date,
    items: document.items,
    subtotal: document.total,
    total: document.total,
    observations: document.observations,
    validUntil: document.validUntil,
    estimatedDate: document.estimatedDate,
  })

  const handleOpenWhatsApp = () => {
    openWhatsApp(document.clientPhone, message)
  }

  const handleCopy = async () => {
    const success = await copyToClipboard(message)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size}>
          <MessageCircle className="h-3 w-3 mr-1" />
          WhatsApp
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleOpenWhatsApp}>
          <MessageCircle className="h-4 w-4 mr-2" />
          Abrir WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2 text-green-600" />
              ¡Copiado!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copiar mensaje
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}