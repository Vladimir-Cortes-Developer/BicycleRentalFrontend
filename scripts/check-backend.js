#!/usr/bin/env node

/**
 * Script para verificar la conectividad con el backend
 * Uso: node scripts/check-backend.js [environment]
 * Ejemplo: node scripts/check-backend.js production
 */

import { config as dotenvConfig } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Obtener el entorno desde argumentos o usar 'development' por defecto
const environment = process.argv[2] || 'development';
const envFile = environment === 'development'
  ? '.env'
  : `.env.${environment}`;

// Cargar variables de entorno
const envPath = resolve(__dirname, '..', envFile);
dotenvConfig({ path: envPath });

const apiBaseUrl = process.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

console.log('🔍 Verificando conectividad con el backend...\n');
console.log(`📝 Entorno: ${environment}`);
console.log(`🌐 URL: ${apiBaseUrl}\n`);

// Función para verificar endpoint
async function checkEndpoint(url, description) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const contentType = response.headers.get('content-type');
    let data = null;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (response.ok) {
      console.log(`✅ ${description}`);
      console.log(`   Status: ${response.status} ${response.statusText}`);
      if (data) {
        console.log(`   Datos: ${JSON.stringify(data).substring(0, 100)}...`);
      }
    } else {
      console.log(`❌ ${description}`);
      console.log(`   Status: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log(`❌ ${description}`);
    console.log(`   Error: ${error.message}`);
  }
  console.log('');
}

// Función principal
async function main() {
  try {
    // Verificar endpoint raíz
    const baseUrl = apiBaseUrl.replace('/api', '');
    await checkEndpoint(baseUrl, 'Endpoint raíz del servidor');

    // Verificar endpoints específicos
    await checkEndpoint(`${apiBaseUrl}/bicycles`, 'GET /api/bicycles');
    await checkEndpoint(`${apiBaseUrl}/events`, 'GET /api/events');

    // Verificar CORS
    console.log('🔐 Verificando configuración CORS...\n');
    try {
      const corsResponse = await fetch(`${apiBaseUrl}/bicycles`, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:5173',
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type, Authorization',
        },
      });

      const corsHeaders = {
        'Access-Control-Allow-Origin': corsResponse.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': corsResponse.headers.get('Access-Control-Allow-Methods'),
        'Access-Control-Allow-Headers': corsResponse.headers.get('Access-Control-Allow-Headers'),
        'Access-Control-Allow-Credentials': corsResponse.headers.get('Access-Control-Allow-Credentials'),
      };

      console.log('✅ Headers CORS:');
      Object.entries(corsHeaders).forEach(([key, value]) => {
        if (value) {
          console.log(`   ${key}: ${value}`);
        }
      });
    } catch (error) {
      console.log('❌ Error verificando CORS:', error.message);
    }

    console.log('\n✨ Verificación completada\n');
  } catch (error) {
    console.error('💥 Error durante la verificación:', error);
    process.exit(1);
  }
}

// Ejecutar
main();