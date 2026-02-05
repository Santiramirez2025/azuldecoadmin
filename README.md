# 🎨 Azul Deco - Sistema de Gestión

Sistema de gestión interno para **Azul Deco**, fábrica de cortinas roller en Villa María, Córdoba, Argentina.

**⚡️ Tus cortinas en 72 hs**

## 🚀 Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Base de datos**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **UI Components**: shadcn/ui
- **Estilos**: Tailwind CSS
- **Notificaciones**: Sonner (toast)
- **Deploy**: Vercel

## 📋 Características

### ✅ Módulos Implementados

1. **Dashboard**
   - Resumen de ventas del mes
   - Documentos recientes
   - Estadísticas de clientes y producción

2. **Gestión de Clientes**
   - CRUD completo de clientes
   - Tipos: MINORISTA | REVENDEDOR
   - Historial de compras por cliente

3. **Catálogo de Cortinas**
   - Tipos de tela: BLACK OUT | SUNSCREEN
   - Colores de tela y sistema
   - Precio calculado por m² (ancho x alto)
   - Precios diferenciados para revendedores

4. **Producción**
   - Vista Kanban: PENDIENTE | EN_PRODUCCIÓN | LISTO | ENTREGADO
   - Gestión de estados de fabricación
   - Fecha estimada de entrega (72hs)

5. **Configuración**
   - Gestión de precios por m²
   - Colores disponibles
   - Recargos por forma de pago
   - Datos del negocio

## 🛠️ Instalación

### 1. Clonar o descargar el proyecto

```bash
cd azul-deco
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar base de datos

Crea una cuenta en [Supabase](https://supabase.com) (gratis) y obtén tu URL de conexión.

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita `.env` y agrega tu URL de Supabase:

```env
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
```

### 4. Inicializar base de datos

```bash
# Crear las tablas en la base de datos
npm run db:push

# Cargar datos iniciales (tipos de tela, colores, etc.)
npm run db:seed
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
azul-deco/
├── prisma/
│   ├── schema.prisma      # Esquema de base de datos
│   └── seed.ts            # Datos iniciales
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Dashboard
│   │   ├── clientes/
│   │   │   ├── page.tsx               # Lista de clientes
│   │   │   ├── nuevo/page.tsx         # Crear cliente
│   │   │   └── [id]/page.tsx          # Ver/Editar cliente
│   │   ├── documentos/
│   │   │   ├── page.tsx               # Lista de documentos
│   │   │   ├── nuevo/page.tsx         # Crear documento
│   │   │   └── [id]/page.tsx          # Ver/Editar documento
│   │   ├── produccion/
│   │   │   └── page.tsx               # Vista Kanban
│   │   ├── configuracion/
│   │   │   └── page.tsx               # Configuración
│   │   └── api/
│   │       ├── clients/route.ts
│   │       ├── documents/route.ts
│   │       ├── fabric-types/route.ts
│   │       └── system-colors/route.ts
│   ├── components/
│   │   ├── ui/                        # Componentes shadcn/ui
│   │   └── sidebar.tsx                # Navegación
│   └── lib/
│       ├── prisma.ts                  # Cliente Prisma
│       └── utils.ts                   # Utilidades
├── package.json
└── README.md
```

## 💾 Scripts Disponibles

```bash
npm run dev          # Ejecutar en desarrollo
npm run build        # Compilar para producción
npm run start        # Ejecutar en producción
npm run db:push      # Sincronizar schema con DB
npm run db:seed      # Cargar datos iniciales
npm run db:studio    # Abrir Prisma Studio (GUI para DB)
```

## 🎯 Próximas Funcionalidades

### Por Implementar

1. **Documentos Completos**
   - Crear presupuestos con cotizador
   - Convertir presupuestos a recibos
   - Generar remitos de envío
   - Descargar PDF de documentos
   - Enviar por WhatsApp

2. **Cotizador de Cortinas**
   - Selector de tipo de tela
   - Selector de color de tela
   - Selector de color de sistema
   - Ingreso de medidas (ancho x alto)
   - Cálculo automático de precio
   - Vista previa de precio en tiempo real

3. **PDF Generation**
   - Presupuestos con logo y datos
   - Recibos con detalles de pago
   - Remitos para envíos

4. **WhatsApp Integration**
   - Enviar presupuestos a clientes
   - Enviar datos de envío a delivery
   - Templates de mensajes

5. **Gestión de Usuarios**
   - Login/Logout
   - Roles: ADMIN | VENDEDOR
   - Permisos por rol

## 📊 Datos Iniciales (Seeds)

Al ejecutar `npm run db:seed`, se crean:

- ✅ Usuario admin (admin@azuldeco.com)
- ✅ 2 tipos de tela (Black Out, Sunscreen)
- ✅ 13 colores de tela (7 para Black Out, 6 para Sunscreen)
- ✅ 4 colores de sistema (Blanco, Negro, Aluminio, Champagne)
- ✅ 3 clientes de prueba
- ✅ Configuración inicial del negocio
- ✅ Recargos por forma de pago

## 🎨 Cálculo de Precios

```typescript
// Ejemplo: Cortina Black Out 150cm x 200cm
// Precio por m² Black Out: $15.000
// 
// Cálculo:
// 150cm = 1.5m
// 200cm = 2.0m
// 1.5m × 2.0m = 3m²
// 3m² × $15.000 = $45.000
```

## 🔧 Tecnologías y Herramientas

- **Next.js 15**: Framework React con App Router
- **TypeScript**: Tipado estático
- **Prisma**: ORM para PostgreSQL
- **Supabase**: Base de datos PostgreSQL en la nube
- **Tailwind CSS**: Estilos utility-first
- **shadcn/ui**: Componentes accesibles y customizables
- **Lucide React**: Iconos
- **Sonner**: Notificaciones toast

## 📞 Contacto

**Azul Deco - Fábrica de Cortinas Roller**
- 📍 Villa María, Córdoba, Argentina
- 🔗 [linktr.ee/AzulDeco](https://linktr.ee/AzulDeco)
- ⚡️ **Tus cortinas en 72 hs**

---

Desarrollado con ❤️ para Azul Deco
