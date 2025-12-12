# ServiGenman - Sistema de Gestión Operativa

<img width="1024" height="1024" alt="logo_servigenman" src="https://github.com/user-attachments/assets/334f32e0-1793-46ea-bd10-2365d9b25070" />

## Descripción

**ServiGenman** es una plataforma web integral que proporciona un control centralizado sobre inventario, facturación, presupuestos, movimientos de recursos, y planificación operativa mediante un calendario interactivo.

## 🎯 Características Principales

### 📦 Gestión de Inventario
- Listado dinámico de recursos con filtros avanzados
- Control de stock en tiempo real con alertas de bajo inventario
- Cargas de fotos por recurso y fotos de ubicación
- Registro de distribuidor y ubicación física
- Exportación a Excel y CSV con selección de columnas
- Historial de cambios pendientes (para roles de desarrollador)

### 💼 Gestión de Facturas
- Registro de facturas de compra y venta
- Seguimiento de pagos (cheques, transferencias, contado)
- Cálculo automático de impuestos (IVA)
- Listado de próximos pagos con alertas de vencimiento
- Interfaz intuitiva para detalles de facturas

### 💰 Presupuestos y Deuda
- Dashboard financiero con KPIs de deuda
- Gráficos de distribución de valores
- Resumen por categoría
- Seguimiento de compromisos de pago pendientes
- Visualización de pagos por mes

### 📅 Calendario Operativo
- Planificación de eventos y mantenimientos
- Múltiples tipos de eventos (facturas, notas, mantenimientos, pagos)
- Filtrado por tipo de evento
- Vista de agenda diaria
- Sistema de leyenda con colores por tipo

### 🚀 Movimientos de Recursos
- Registro de salidas de inventario
- Comentarios y justificaciones
- Historial de movimientos
- Integración con inventario

### 🎨 Experiencia de Usuario
- Tema claro/oscuro con persistencia
- Soporte multiidioma (Español)
- Interfaz responsiva
- Chat integrado con N8N
- Contraseña recuperable

## 🏗️ Arquitectura

### Stack Tecnológico

**Frontend:**
- **Framework:** Next.js 15+ (React 19)
- **Estilos:** Tailwind CSS + CSS personalizado
- **Lenguaje:** TypeScript
- **Herramientas:** ESLint, Node 20+

**Backend:**
- **Framework:** Django 5.0+
- **API:** Django REST Framework
- **Base de Datos:** SQLite (desarrollo) / PostgreSQL (producción)
- **Dependencias:** python-dotenv, django-cors-headers, Pillow, PyPDF2, pytesseract

## 📋 Requisitos

### Desarrollo
- **Node.js:** v20.11.0+
- **Python:** 3.10+
- **npm** o **yarn** para el frontend

### Dependencias Principales

**Frontend:**
```
next@^15.5.7
react@19.1.0
react-dom@19.1.0
tailwindcss@^4
```

**Backend:**
```
django>=5.0,<6.0
djangorestframework>=3.15.2
django-cors-headers>=4.4
Pillow>=10.4.0
pdf2image>=1.17.0
PyPDF2>=3.0.1
pytesseract>=0.3.10
python-dotenv>=1.0
```

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone <https://github.com/Jona238/CapstoneServigenman.git>
cd CapstoneServigenman
```

### 2. Frontend Setup

```bash
cd "FASE 2/Evidencias de Proyecto/frontend"
npm install
```

**Variables de entorno** (crear `.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### 3. Backend Setup

```bash
cd "FASE 2/Evidencias de Proyecto/backend"
pip install -r requirements.txt
```

**Configuración inicial:**
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

## 🏃 Ejecución

### Frontend (Desarrollo)

```bash
cd frontend
npm run dev
```

Accede en: `http://localhost:3000`

**Comandos disponibles:**
- `npm run dev` - Servidor de desarrollo
- `npm run dev:win` - Windows con configuración específica

### Backend (Desarrollo)

```bash
cd backend
python manage.py runserver
```

API disponible en: `http://localhost:8000/api/`

## 📁 Estructura del Proyecto

```
CapstoneServigenman/
├── FASE 2/
│   └── Evidencias de Proyecto/
│       ├── frontend/
│       │   ├── src/
│       │   │   ├── app/
│       │   │   │   ├── inventario/        # Gestión de inventario
│       │   │   │   ├── facturas/          # Gestión de facturas
│       │   │   │   ├── presupuesto/       # Dashboard de presupuestos
│       │   │   │   ├── calendario/        # Calendario operativo
│       │   │   │   ├── movimientos/       # Movimientos de recursos
│       │   │   │   ├── categorias/        # Gestión de categorías
│       │   │   │   └── (auth)/            # Autenticación
│       │   │   ├── components/            # Componentes reutilizables
│       │   │   ├── contexts/              # Context API
│       │   │   ├── hooks/                 # Custom hooks
│       │   │   └── lib/                   # Utilidades
│       │   └── package.json
│       └── backend/
│           ├── core/                      # Configuración principal
│           ├── accounts/                  # Gestión de usuarios
│           ├── inventory/                 # Módulo de inventario
│           ├── invoices/                  # Módulo de facturas
│           └── requirements.txt
```

## 🔐 Autenticación

El sistema utiliza autenticación basada en **cookies** con validación de sesión. Se incluye recuperación de contraseña mediante código temporal.

**Roles:**
- **Usuario Estándar:** Acceso a funcionalidades principales
- **Desarrollador:** Acceso a papelera y cambios pendientes

## 🌍 Multiidioma

El sistema soporta múltiples idiomas a través de **LanguageContext**. Actualmente soportado: **Español**.

## 🎨 Tema

Sistema de tema claro/oscuro persistente:
- Almacenado en `localStorage`
- Aplicado a través de `data-theme` en el body
- Estilos CSS adaptativos con selectores `body[data-theme="dark"]`

## 💾 Almacenamiento

**Frontend:**
- localStorage para: tema, idioma, configuraciones de usuario
- Cache de datos operativos (con límites de cuota)

**Backend:**
- Base de datos SQLite/PostgreSQL
- Sistema de cambios pendientes (auditoría)


## 🤝 Contribución

Las contribuciones están bienvenidas. Por favor:
1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request


## 👤 Autor

Desarrollado como proyecto de capstone por Jonathan Morales, Nicolas Vergara y Diego Santis.

