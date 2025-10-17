# Guía de Configuración y Despliegue - Bicycle Rental Frontend

Esta guía te ayudará a configurar y desplegar la aplicación frontend del sistema de alquiler de bicicletas.

## Tabla de Contenidos

1. [Configuración de Entornos](#configuración-de-entornos)
2. [Instalación](#instalación)
3. [Desarrollo](#desarrollo)
4. [Build y Despliegue](#build-y-despliegue)
5. [Configuración CORS](#configuración-cors)
6. [Variables de Entorno](#variables-de-entorno)

---

## Configuración de Entornos

El proyecto está configurado para trabajar con tres entornos:

- **Development** (Desarrollo local)
- **Staging** (Pre-producción)
- **Production** (Producción)

Cada entorno tiene su propio archivo de configuración:

```
.env                  # Desarrollo (local)
.env.staging          # Staging
.env.production       # Producción
.env.example          # Plantilla de ejemplo
```

### URLs Configuradas

#### Backend - Desarrollo
```
http://localhost:3000/api
```

#### Backend - Producción (Azure)
```
https://backendbicycles-dyf5bfh6hkhmagbq.eastus-01.azurewebsites.net/api
```

---

## Instalación

### Prerrequisitos

- Node.js >= 18.x
- npm >= 9.x
- Git

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd BicycleRentalFrontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Copiar el archivo de ejemplo
   cp .env.example .env

   # Editar .env con tus configuraciones locales
   # VITE_API_BASE_URL=http://localhost:3000/api
   ```

---

## Desarrollo

### Iniciar servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

### Características del servidor de desarrollo

- Hot Module Replacement (HMR)
- Proxy configurado para `/api` → `http://localhost:3000`
- Auto-reload al guardar cambios
- Source maps habilitados

---

## Build y Despliegue

### Build para Desarrollo
```bash
npm run build
```

### Build para Staging
```bash
npm run build:staging
```

### Build para Producción
```bash
npm run build:production
```

Los archivos compilados se generarán en la carpeta `dist/`

### Preview del Build

Después de hacer el build, puedes previsualizar la aplicación:

```bash
# Preview del build de desarrollo
npm run preview

# Preview del build de staging
npm run preview:staging

# Preview del build de producción
npm run preview:production
```

---

## Archivos de Configuración para Azure

El proyecto incluye archivos de configuración para ambos tipos de despliegue en Azure:

### Azure Static Web Apps
- **Archivo**: `staticwebapp.config.json` (raíz del proyecto)
- **Propósito**: Configuración de rutas, fallback y redirecciones

### Azure App Service (Web App)
- **Archivo**: `public/web.config` (se copia automáticamente al build)
- **Propósito**: Configuración de IIS para SPA con React Router

## Despliegue en Azure Static Web Apps

### Opción 1: Deployment Manual

1. **Build de producción**
   ```bash
   npm run build:production
   ```

2. **Instalar Azure CLI** (si no la tienes)
   ```bash
   npm install -g @azure/static-web-apps-cli
   ```

3. **Deploy con Azure CLI**
   ```bash
   swa deploy ./dist \
     --app-name bicycle-rental-frontend \
     --env production
   ```

### Opción 2: GitHub Actions (Recomendado)

Crea un archivo `.github/workflows/azure-static-web-apps.yml`:

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build:production
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}

      - name: Deploy to Azure Static Web Apps
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: "dist"
```

### Configurar Secrets en GitHub

1. Ve a tu repositorio en GitHub
2. Settings → Secrets and variables → Actions
3. Agrega los siguientes secrets:
   - `AZURE_STATIC_WEB_APPS_API_TOKEN`: Token de tu Azure Static Web App
   - `VITE_API_BASE_URL`: URL del backend en producción

---

## Configuración CORS

⚠️ **IMPORTANTE**: El backend debe estar configurado para aceptar solicitudes del frontend.

Consulta el archivo [CORS_CONFIGURATION.md](./CORS_CONFIGURATION.md) para instrucciones detalladas.

### Verificación Rápida

El backend ya está configurado con CORS. Puedes verificar con:

```bash
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://backendbicycles-dyf5bfh6hkhmagbq.eastus-01.azurewebsites.net/api
```

Deberías ver headers como:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Variables de Entorno

### Variables Disponibles

| Variable | Descripción | Requerida | Default |
|----------|-------------|-----------|---------|
| `VITE_API_BASE_URL` | URL base del backend API | Sí | `http://localhost:3000/api` |
| `VITE_MAP_API_KEY` | API key para mapas (Leaflet) | No | `''` |
| `VITE_ENV` | Entorno de ejecución | No | `development` |

### Configuración por Entorno

#### Development (.env)
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_MAP_API_KEY=
VITE_ENV=development
```

#### Staging (.env.staging)
```env
VITE_API_BASE_URL=https://backendbicycles-dyf5bfh6hkhmagbq.eastus-01.azurewebsites.net/api
VITE_MAP_API_KEY=
VITE_ENV=staging
```

#### Production (.env.production)
```env
VITE_API_BASE_URL=https://backendbicycles-dyf5bfh6hkhmagbq.eastus-01.azurewebsites.net/api
VITE_MAP_API_KEY=
VITE_ENV=production
```

### Acceso a Variables en el Código

```typescript
// Usando import.meta.env
const apiUrl = import.meta.env.VITE_API_BASE_URL

// Usando el archivo de configuración (recomendado)
import config from '@/config/env'
console.log(config.apiBaseUrl)
console.log(config.isProduction)
```

---

## Testing

### Lint
```bash
npm run lint
```

### Build Test
```bash
npm run build
```

---

## Troubleshooting

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"
- Verifica que el backend esté ejecutándose
- Confirma la configuración CORS del backend
- Revisa que la URL en `VITE_API_BASE_URL` sea correcta

### Error: "Cannot connect to backend"
- Verifica que el backend esté corriendo en la URL configurada
- Prueba el endpoint manualmente:
  ```bash
  curl https://backendbicycles-dyf5bfh6hkhmagbq.eastus-01.azurewebsites.net/api/bicycles
  ```

### Build falla con error de TypeScript
```bash
# Limpia la caché y reinstala
rm -rf node_modules dist tsconfig.tsbuildinfo
npm install
npm run build
```

---

## Estructura de Archivos

```
BicycleRentalFrontend/
├── src/
│   ├── api/              # Servicios API
│   ├── components/       # Componentes reutilizables
│   ├── config/
│   │   └── env.ts       # Configuración de entorno
│   ├── pages/           # Páginas de la aplicación
│   ├── types/           # Tipos TypeScript
│   └── main.tsx         # Punto de entrada
├── .env                 # Variables de desarrollo
├── .env.staging         # Variables de staging
├── .env.production      # Variables de producción
├── .env.example         # Plantilla de ejemplo
├── vite.config.ts       # Configuración Vite
├── package.json         # Dependencias
└── README.md            # Este archivo
```

---

## Recursos Adicionales

- [Documentación de Vite](https://vitejs.dev/)
- [Documentación de React](https://react.dev/)
- [Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/)
- [CORS Configuration Guide](./CORS_CONFIGURATION.md)

---

## Contacto y Soporte

Para preguntas o problemas, contacta al equipo de desarrollo.