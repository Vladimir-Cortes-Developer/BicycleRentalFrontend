# Configuración CORS para el Backend

Este documento describe la configuración necesaria de CORS (Cross-Origin Resource Sharing) en el backend para que el frontend pueda comunicarse correctamente con la API.

## URLs del Frontend

### Desarrollo
- **Local**: `http://localhost:5173`
- **Vite Preview**: `http://localhost:4173`

### Producción
- **Azure Static Web App**: Deberás configurar la URL una vez desplegada
- **Ejemplo**: `https://your-app.azurestaticapps.net`

## Configuración CORS Recomendada

### Para Desarrollo

El backend debe permitir solicitudes desde:
```
http://localhost:5173
http://localhost:4173
http://localhost:3000
http://127.0.0.1:5173
```

### Para Producción

El backend debe permitir solicitudes desde:
```
https://backendbicycles-dyf5bfh6hkhmagbq.eastus-01.azurewebsites.net
https://your-frontend-domain.com
```

## Configuración en NestJS (si aplica)

```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:4173',
      'https://your-frontend-domain.com',
      // Agrega más orígenes según sea necesario
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
```

## Configuración en Express (si aplica)

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://your-frontend-domain.com',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
  ],
  credentials: true,
};

app.use(cors(corsOptions));
```

## Configuración en Azure App Service

Para configurar CORS directamente en Azure App Service:

1. Ve al **Portal de Azure**
2. Navega a tu **App Service**
3. En el menú lateral, selecciona **CORS**
4. Agrega los orígenes permitidos:
   ```
   http://localhost:5173
   http://localhost:4173
   https://your-frontend-domain.com
   ```
5. **NO** habilites "Allow all origins" en producción por seguridad
6. Guarda los cambios

## Headers Necesarios

El backend debe enviar los siguientes headers en las respuestas:

```
Access-Control-Allow-Origin: <origin>
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

## Problemas Comunes

### 1. Error: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Solución**: Asegúrate de que el backend esté configurado para aceptar solicitudes del origen del frontend.

### 2. Error: "CORS policy: The value of the 'Access-Control-Allow-Credentials' header"
**Solución**: Si usas `credentials: true` en el frontend, el backend debe:
- Configurar `credentials: true` en CORS
- NO usar `origin: '*'` (debe especificar orígenes exactos)

### 3. Preflight Requests (OPTIONS)
**Solución**: El backend debe manejar correctamente las solicitudes OPTIONS que el navegador envía antes de las solicitudes reales.

## Verificación

Para verificar que CORS está configurado correctamente:

1. Abre las DevTools del navegador (F12)
2. Ve a la pestaña **Network**
3. Realiza una solicitud a la API
4. Inspecciona los headers de la respuesta
5. Verifica que contengan `Access-Control-Allow-Origin`

## Seguridad

⚠️ **Importante**:
- **NO** uses `origin: '*'` en producción
- Lista explícitamente los orígenes permitidos
- Usa HTTPS en producción
- Mantén actualizada la lista de orígenes permitidos
- Considera usar variables de entorno para configurar los orígenes

## Variables de Entorno Recomendadas (Backend)

```env
# .env
CORS_ORIGIN=http://localhost:5173,http://localhost:4173

# .env.production
CORS_ORIGIN=https://your-frontend-domain.com
```

## Testing CORS

Puedes probar CORS usando curl:

```bash
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     --verbose \
     https://backendbicycles-dyf5bfh6hkhmagbq.eastus-01.azurewebsites.net/api/auth/login
```

Deberías ver headers de CORS en la respuesta.