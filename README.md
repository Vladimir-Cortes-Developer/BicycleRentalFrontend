# SENA - Sistema de Alquiler de Bicicletas (Frontend)

Frontend del sistema de alquiler de bicicletas para el SENA, desarrollado con React, TypeScript, Tailwind CSS y Vite.

## Tecnologías Utilizadas

- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **React Router v6** - Navegación
- **Axios** - Cliente HTTP
- **React Hook Form + Yup** - Validación de formularios
- **React Hot Toast** - Notificaciones
- **Leaflet / React Leaflet** - Mapas interactivos
- **Recharts** - Gráficos y visualizaciones
- **Lucide React** - Íconos
- **Date-fns** - Manejo de fechas

## Estructura del Proyecto

```
src/
├── api/              # Servicios de API y cliente HTTP
├── assets/           # Imágenes y recursos estáticos
├── components/       # Componentes React
│   ├── common/       # Componentes compartidos (Button, Input, Modal, etc.)
│   └── layout/       # Layouts (MainLayout, AdminLayout)
├── constants/        # Constantes de la aplicación
├── contexts/         # Context API (AuthContext)
├── guards/           # Route guards (PrivateRoute, AdminRoute)
├── hooks/            # Custom hooks
├── pages/            # Páginas/vistas de la aplicación
│   ├── auth/         # Login y registro
│   ├── bicycles/     # Catálogo de bicicletas
│   ├── events/       # Eventos y ciclopaseos
│   ├── rentals/      # Alquileres
│   └── admin/        # Panel administrativo
├── routes/           # Configuración de rutas
├── types/            # Tipos e interfaces TypeScript
└── utils/            # Utilidades y helpers
```

## Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. Ejecutar en Desarrollo

```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:5173`

### 4. Compilar para Producción

```bash
npm run build
```

### 5. Vista Previa de Producción

```bash
npm run preview
```

## Características Implementadas

### ✅ Configuración Base
- [x] Proyecto configurado con Vite + React + TypeScript
- [x] Tailwind CSS con tema personalizado SENA
- [x] React Router con guards de rutas
- [x] Variables de entorno

### ✅ API e Integración
- [x] Cliente Axios con interceptors
- [x] Servicios para todos los módulos (Auth, Bicycles, Rentals, Events, Maintenance, Reports)
- [x] Manejo de errores global
- [x] Sistema de notificaciones (Toasts)

### ✅ Autenticación y Autorización
- [x] Context API para gestión de estado de autenticación
- [x] Guards de rutas (PublicRoute, PrivateRoute, AdminRoute)
- [x] Login funcional
- [ ] Registro de usuarios (pendiente)

### ✅ Componentes Compartidos
- [x] Button
- [x] Input, Select, TextArea
- [x] Card
- [x] Modal y ConfirmModal
- [x] Badge
- [x] Spinner

### ✅ Layouts
- [x] MainLayout (para usuarios)
- [x] AdminLayout (para administradores)

### 📋 Módulos Pendientes de Implementar

#### Usuario
- [ ] Vista de catálogo de bicicletas con filtros
- [ ] Detalle de bicicleta
- [ ] Funcionalidad de alquiler de bicicletas
- [ ] Funcionalidad de devolución de bicicletas
- [ ] Vista de alquiler activo
- [ ] Historial de alquileres
- [ ] Vista de eventos disponibles
- [ ] Registro y cancelación de eventos
- [ ] Perfil de usuario

#### Administrador
- [ ] Dashboard con estadísticas
- [ ] CRUD de bicicletas
- [ ] Gestión de alquileres
- [ ] CRUD de eventos
- [ ] Gestión de mantenimiento
- [ ] Reportes de ganancias
- [ ] Gráficos y visualizaciones
- [ ] Mapa interactivo de bicicletas

## Tipos de Usuario

### Usuario Regular
- Visualizar bicicletas disponibles
- Alquilar bicicletas
- Devolver bicicletas
- Ver historial de alquileres
- Inscribirse a eventos
- Ver perfil

### Administrador
- Todas las funciones de usuario regular
- Gestionar bicicletas (CRUD)
- Gestionar eventos (CRUD)
- Gestionar mantenimiento
- Ver reportes y estadísticas
- Visualizar mapa de bicicletas

## Rutas de la Aplicación

### Públicas
- `/login` - Inicio de sesión
- `/register` - Registro de usuarios

### Usuario (Privadas)
- `/` - Página de inicio
- `/bicycles` - Catálogo de bicicletas
- `/bicycles/:id` - Detalle de bicicleta
- `/my-rental` - Mi alquiler activo
- `/rental-history` - Historial de alquileres
- `/events` - Eventos disponibles
- `/events/:id` - Detalle del evento
- `/my-events` - Mis eventos inscritos
- `/profile` - Perfil de usuario

### Admin (Privadas - Solo Admin)
- `/admin` - Dashboard administrativo
- `/admin/bicycles` - Gestión de bicicletas
- `/admin/bicycles/create` - Crear bicicleta
- `/admin/bicycles/:id/edit` - Editar bicicleta
- `/admin/rentals` - Gestión de alquileres
- `/admin/events` - Gestión de eventos
- `/admin/events/create` - Crear evento
- `/admin/events/:id/edit` - Editar evento
- `/admin/maintenance` - Gestión de mantenimiento
- `/admin/reports` - Reportes y estadísticas
- `/admin/map` - Mapa de bicicletas

## API Endpoints

El frontend se conecta al backend en `http://localhost:3000/api`:

- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `GET /auth/me` - Obtener perfil
- `GET /bicycles` - Listar bicicletas
- `GET /bicycles/available` - Bicicletas disponibles
- `POST /bicycles` - Crear bicicleta (Admin)
- `PUT /bicycles/:id` - Actualizar bicicleta (Admin)
- `DELETE /bicycles/:id` - Eliminar bicicleta (Admin)
- `POST /rentals` - Alquilar bicicleta
- `PUT /rentals/:id/return` - Devolver bicicleta
- `GET /rentals/my` - Mis alquileres
- `GET /rentals/my/active` - Mi alquiler activo
- `GET /events` - Listar eventos
- `GET /events/upcoming` - Eventos próximos
- `POST /events/:id/register` - Inscribirse a evento
- `GET /reports/dashboard` - Estadísticas del dashboard (Admin)
- `GET /reports/revenue/monthly` - Ingresos mensuales (Admin)

## Colores del Tema

```css
- SENA Orange: #FF5700
- SENA Green: #39A900
- SENA Dark: #1E1E1E
- SENA Gray: #666666
```

## Scripts Disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Compila para producción
npm run lint     # Ejecuta ESLint
npm run preview  # Vista previa de la build de producción
```

## Estado del Proyecto

### Completado (40%)
- ✅ Configuración del proyecto
- ✅ Estructura de carpetas
- ✅ Servicios de API
- ✅ Sistema de autenticación
- ✅ Guards de rutas
- ✅ Componentes compartidos
- ✅ Layouts
- ✅ Manejo de errores
- ✅ Sistema de notificaciones

### En Progreso (0%)
- 🚧 Implementación de páginas de usuario
- 🚧 Implementación de páginas de administrador

### Pendiente (60%)
- ⏳ Todas las funcionalidades de usuario
- ⏳ Todas las funcionalidades de administrador
- ⏳ Mapas interactivos
- ⏳ Gráficos y reportes
- ⏳ Testing
- ⏳ Optimizaciones de rendimiento

## Próximos Pasos

1. Implementar página de registro de usuarios
2. Implementar catálogo de bicicletas con filtros
3. Implementar funcionalidad de alquiler y devolución
4. Implementar gestión de eventos
5. Implementar dashboard de administrador
6. Integrar mapas interactivos
7. Implementar reportes y gráficos
8. Testing y optimizaciones

## Autor

Proyecto desarrollado para el SENA - Sistema de Alquiler de Bicicletas

## Licencia

Este proyecto es parte de un ejercicio académico del SENA.