# 🚀 GUÍA DE INSTALACIÓN - AZUL DECO

## Paso 1: Requisitos Previos

Asegúrate de tener instalado:
- Node.js 18 o superior ([descargar](https://nodejs.org/))
- npm o yarn
- Git (opcional)

## Paso 2: Configurar Base de Datos en Supabase

### 2.1 Crear cuenta en Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Regístrate con GitHub, Google o email

### 2.2 Crear nuevo proyecto
1. Click en "New Project"
2. Llena los datos:
   - **Name**: azul-deco
   - **Database Password**: Genera una contraseña segura (guárdala)
   - **Region**: South America (São Paulo) - es la más cercana
   - **Pricing Plan**: Free (gratis)
3. Click en "Create new project"
4. Espera 2-3 minutos mientras se crea

### 2.3 Obtener URL de conexión
1. En el menú lateral, click en "Project Settings" (⚙️)
2. Click en "Database"
3. Busca "Connection string" → "URI"
4. Copia la URL que se ve así:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
5. Reemplaza `[YOUR-PASSWORD]` con tu contraseña

## Paso 3: Configurar el Proyecto

### 3.1 Abrir terminal en la carpeta del proyecto
```bash
cd azul-deco
```

### 3.2 Instalar dependencias
```bash
npm install
```
⏱️ Esto puede tomar 2-3 minutos

### 3.3 Configurar variables de entorno
1. Crea un archivo `.env` en la raíz del proyecto
2. Pega este contenido y reemplaza con tu URL de Supabase:

```env
DATABASE_URL="TU_URL_DE_SUPABASE_AQUI"
```

Ejemplo:
```env
DATABASE_URL="postgresql://postgres:mi_password_123@db.abcdefgh.supabase.co:5432/postgres"
```

## Paso 4: Inicializar Base de Datos

### 4.1 Crear tablas
```bash
npm run db:push
```

Deberías ver:
```
✔ Generated Prisma Client
✔ Database synchronized
```

### 4.2 Cargar datos iniciales
```bash
npm run db:seed
```

Deberías ver:
```
🌱 Iniciando seeds...
✅ Usuario creado
✅ Tipos de tela creados
✅ Colores Black Out creados
✅ Colores Sunscreen creados
✅ Colores de sistema creados
✅ Clientes de prueba creados
✅ Configuración inicial creada
🎉 Seeds completados exitosamente!
```

## Paso 5: Ejecutar el Proyecto

```bash
npm run dev
```

Deberías ver:
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
- Ready in X.Xs
```

## Paso 6: Abrir en el Navegador

1. Abre tu navegador
2. Ve a: **http://localhost:3000**
3. ¡Deberías ver el Dashboard de Azul Deco! 🎉

## 🎯 ¿Qué puedes hacer ahora?

### Explorar la aplicación:
- **Dashboard**: Ver resumen general
- **Clientes**: Ver los 3 clientes de prueba
- **Documentos**: Explorar la estructura (aún vacía)
- **Producción**: Ver la vista Kanban
- **Configuración**: Ver precios y colores

### Crear tu primer cliente:
1. Click en "Clientes" en el menú lateral
2. Click en "Nuevo Cliente"
3. Llena el formulario
4. Click en "Crear Cliente"

### Ver la base de datos (opcional):
```bash
npm run db:studio
```
Esto abre Prisma Studio en http://localhost:5555

## 🛠️ Comandos Útiles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Ver base de datos (GUI)
npm run db:studio

# Actualizar base de datos después de cambios en schema
npm run db:push

# Recargar datos iniciales
npm run db:seed
```

## ❗ Solución de Problemas

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "DATABASE_URL not found"
- Verifica que el archivo `.env` existe
- Verifica que la URL esté entre comillas
- Reinicia el servidor (`Ctrl+C` y `npm run dev`)

### Error de conexión a Supabase
- Verifica que tu contraseña esté correcta en la URL
- Verifica que no haya espacios en la URL
- Verifica tu conexión a internet

### El puerto 3000 está ocupado
```bash
# Usar otro puerto
npm run dev -- -p 3001
```

## 📚 Próximos Pasos

1. ✅ Explorar la aplicación
2. ✅ Crear algunos clientes de prueba
3. ✅ Familiarizarte con la interfaz
4. 🔜 Implementar el cotizador de cortinas
5. 🔜 Crear presupuestos
6. 🔜 Generar PDFs

## 💡 Tips

- **Prisma Studio** es tu mejor amigo para ver y editar datos
- Los cambios en el código se reflejan automáticamente (Hot Reload)
- Usa `Ctrl+C` para detener el servidor
- Los errores aparecen en la consola Y en el navegador

---

¿Algún problema? Revisa el README.md o contacta al desarrollador.
