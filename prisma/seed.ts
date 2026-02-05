import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seeds...')

  // Limpiar datos existentes (opcional - comentar si quieres mantener datos)
  // await prisma.documentItem.deleteMany()
  // await prisma.document.deleteMany()
  // await prisma.fabricColor.deleteMany()
  // await prisma.fabricType.deleteMany()
  // await prisma.systemColor.deleteMany()
  // await prisma.client.deleteMany()
  // await prisma.user.deleteMany()
  // await prisma.setting.deleteMany()

  // ═══════════════════════════════════════════════════════════
  // USUARIOS
  // ═══════════════════════════════════════════════════════════
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@azuldeco.com' },
    update: {},
    create: {
      email: 'admin@azuldeco.com',
      name: 'Admin Azul Deco',
      role: 'ADMIN',
    },
  })

  console.log('✅ Usuario creado:', user.email)

  // ═══════════════════════════════════════════════════════════
  // TIPOS DE TELA
  // ═══════════════════════════════════════════════════════════
  
  const blackOut = await prisma.fabricType.upsert({
    where: { code: 'BLACKOUT' },
    update: {},
    create: {
      name: 'Black Out',
      code: 'BLACKOUT',
      pricePerSqm: 15000,
      resellerPrice: 12000,
      description: 'Tela opaca que bloquea completamente la luz',
    },
  })

  const sunscreen = await prisma.fabricType.upsert({
    where: { code: 'SUNSCREEN' },
    update: {},
    create: {
      name: 'Sunscreen',
      code: 'SUNSCREEN',
      pricePerSqm: 18000,
      resellerPrice: 14500,
      description: 'Tela traslúcida que filtra la luz solar',
    },
  })

  console.log('✅ Tipos de tela creados')

  // ═══════════════════════════════════════════════════════════
  // COLORES DE TELA - BLACK OUT
  // ═══════════════════════════════════════════════════════════
  
  const blackOutColors = [
    { name: 'Blanco', hexCode: '#FFFFFF' },
    { name: 'Crudo', hexCode: '#F5F5DC' },
    { name: 'Beige', hexCode: '#F5E6D3' },
    { name: 'Gris Claro', hexCode: '#D3D3D3' },
    { name: 'Gris', hexCode: '#808080' },
    { name: 'Gris Oscuro', hexCode: '#4A4A4A' },
    { name: 'Negro', hexCode: '#000000' },
  ]

  for (const color of blackOutColors) {
    await prisma.fabricColor.upsert({
      where: {
        fabricTypeId_name: {
          fabricTypeId: blackOut.id,
          name: color.name,
        },
      },
      update: {},
      create: {
        name: color.name,
        hexCode: color.hexCode,
        fabricTypeId: blackOut.id,
      },
    })
  }

  console.log('✅ Colores Black Out creados')

  // ═══════════════════════════════════════════════════════════
  // COLORES DE TELA - SUNSCREEN
  // ═══════════════════════════════════════════════════════════
  
  const sunscreenColors = [
    { name: 'Blanco', hexCode: '#FFFFFF' },
    { name: 'Crudo', hexCode: '#F5F5DC' },
    { name: 'Gris Perla', hexCode: '#C0C0C0' },
    { name: 'Gris', hexCode: '#808080' },
    { name: 'Lino', hexCode: '#E8DCC4' },
    { name: 'Arena', hexCode: '#C2B280' },
  ]

  for (const color of sunscreenColors) {
    await prisma.fabricColor.upsert({
      where: {
        fabricTypeId_name: {
          fabricTypeId: sunscreen.id,
          name: color.name,
        },
      },
      update: {},
      create: {
        name: color.name,
        hexCode: color.hexCode,
        fabricTypeId: sunscreen.id,
      },
    })
  }

  console.log('✅ Colores Sunscreen creados')

  // ═══════════════════════════════════════════════════════════
  // COLORES DE SISTEMA
  // ═══════════════════════════════════════════════════════════
  
  const systemColors = [
    { name: 'Blanco', hexCode: '#FFFFFF' },
    { name: 'Negro', hexCode: '#000000' },
    { name: 'Aluminio', hexCode: '#A8A9AD' },
    { name: 'Champagne', hexCode: '#F7E7CE' },
  ]

  for (const color of systemColors) {
    await prisma.systemColor.upsert({
      where: { name: color.name },
      update: {},
      create: {
        name: color.name,
        hexCode: color.hexCode,
      },
    })
  }

  console.log('✅ Colores de sistema creados')

  // ═══════════════════════════════════════════════════════════
  // CLIENTES DE PRUEBA
  // ═══════════════════════════════════════════════════════════
  
  await prisma.client.create({
    data: {
      name: 'María González',
      type: 'MINORISTA',
      phone: '3534-123456',
      email: 'maria@email.com',
      address: 'Av. San Martín 450',
      city: 'Villa María',
      province: 'Córdoba',
    },
  })

  await prisma.client.create({
    data: {
      name: 'Juan Pérez - Revendedor',
      type: 'REVENDEDOR',
      phone: '3534-654321',
      email: 'juan@revendedor.com',
      address: 'Calle Corrientes 123',
      city: 'Villa María',
      province: 'Córdoba',
      notes: 'Cliente mayorista - descuento especial aplicado',
    },
  })

  await prisma.client.create({
    data: {
      name: 'Ana Martínez',
      type: 'MINORISTA',
      phone: '3534-789012',
      address: 'Bv. Roca 890',
      city: 'Villa María',
      province: 'Córdoba',
    },
  })

  console.log('✅ Clientes de prueba creados')

  // ═══════════════════════════════════════════════════════════
  // CONFIGURACIÓN
  // ═══════════════════════════════════════════════════════════
  
  await prisma.setting.upsert({
    where: { key: 'business_info' },
    update: {},
    create: {
      key: 'business_info',
      value: {
        name: 'Azul Deco',
        slogan: '⚡️ Tus cortinas en 72 hs',
        address: 'Villa María, Córdoba, Argentina',
        phone: '3534-XXXXXX',
        email: 'info@azuldeco.com',
        website: 'linktr.ee/AzulDeco',
      },
    },
  })

  await prisma.setting.upsert({
    where: { key: 'payment_surcharges' },
    update: {},
    create: {
      key: 'payment_surcharges',
      value: {
        CONTADO: 0,
        CUOTAS_3: 15,
        CUOTAS_6: 25,
        CUOTAS_12: 45,
      },
    },
  })

  await prisma.setting.upsert({
    where: { key: 'default_validity_days' },
    update: {},
    create: {
      key: 'default_validity_days',
      value: 7,
    },
  })

  await prisma.setting.upsert({
    where: { key: 'default_delivery_hours' },
    update: {},
    create: {
      key: 'default_delivery_hours',
      value: 72,
    },
  })

  console.log('✅ Configuración inicial creada')

  console.log('\n🎉 Seeds completados exitosamente!\n')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error en seeds:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
